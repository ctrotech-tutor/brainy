import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

// ============================================
// ROUTE DEFINITIONS
// ============================================

const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/signup",
];

const ONBOARDING_ROUTES = [
  "/onboarding",
];

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/platform",
  ...ONBOARDING_ROUTES,
];

// API routes that don't need CSRF protection (Auth.js handles its own)
const API_PUBLIC_ROUTES = [
  "/api/auth", // Catch-all for NextAuth
];

// ============================================
// proxy
// ============================================

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth; // Auth.js session

  const isAuthenticated = !!session;
  const user = session?.user as any;
  const roles: string[] = user?.roles ?? [];
  const onboardingComplete = user?.onboardingComplete ?? true;

  const isApiRoute = pathname.startsWith("/api/");
  const isHomePage = pathname === "/";

  // Helper to determine the best dashboard landing for a user
  const getDashboardPath = (userRoles: string[]) => {
    if (userRoles.includes("PLATFORM_ADMIN")) return "/platform/dashboard";
    if (userRoles.includes("INSTITUTION_ADMIN")) return "/dashboard/institution";
    if (userRoles.includes("STUDENT")) return "/dashboard/student";
    if (userRoles.includes("TUTOR")) return "/dashboard/tutor";
    return "/dashboard";
  };

  // ============================================
  // PUBLIC ROUTES (Always Accessible)
  // ============================================

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // APIs handled separately later
  if (isPublicRoute && !isApiRoute && !AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // ============================================
  // AUTH ROUTES (Redirect if already logged in)
  // ============================================

  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    const dashboardPath = getDashboardPath(roles);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // ============================================
  // ONBOARDING ENFORCEMENT
  // ============================================

  const isOnboardingRoute = ONBOARDING_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (
    isAuthenticated &&
    !onboardingComplete &&
    !isOnboardingRoute &&
    !isApiRoute &&
    !isHomePage
  ) {
    let redirectPath = "/onboarding/choose-path";

    if (user?.onboardingIntent === "student") {
      redirectPath = "/onboarding/student/start";
    } else if (user?.onboardingIntent === "institution") {
      redirectPath = "/onboarding/institution/start";
    }

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ============================================
  // PROTECTED ROUTES & DASHBOARD LANDING
  // ============================================

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // Redirect the generic /dashboard to the actual role-specific dashboard
    if (pathname === "/dashboard") {
      const dashboardPath = getDashboardPath(roles);
      if (dashboardPath !== "/dashboard") {
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    }
  }

  // ============================================
  // API AUTHENTICATION
  // ============================================

  if (isApiRoute && !isAuthenticated) {
    const isPublicApiRoute = API_PUBLIC_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    if (!isPublicApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
});

// ============================================
// CONFIG
// ============================================

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
