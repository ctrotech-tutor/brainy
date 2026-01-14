import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestOrigin } from "lucia";

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
  ...ONBOARDING_ROUTES,
];

// API routes that don't need CSRF protection
const API_PUBLIC_ROUTES = [
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/verify-email",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/google",
  "/api/auth/google/callback",
];

// ============================================
// EDGE-SAFE SESSION PARSER
// ============================================

function getSessionFromCookie(request: NextRequest) {
  const raw = request.cookies.get("brainy-session")?.value;
  if (!raw) return null;

  try {
    // If JWT or base64 JSON
    const payload = JSON.parse(atob(raw.split(".")[1] ?? ""));
    return payload;
  } catch {
    // Fallback: treat cookie presence as auth
    return { authenticated: true };
  }
}

// ============================================
// proxy
// ============================================

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // CSRF PROTECTION (API only)
  // ============================================

  if (request.method !== "GET" && pathname.startsWith("/api/")) {
    const isPublicApiRoute = API_PUBLIC_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    if (!isPublicApiRoute) {
      const origin = request.headers.get("Origin");
      const host = request.headers.get("Host");

      if (!origin || !host || !verifyRequestOrigin(origin, [host])) {
        return NextResponse.json(
          { error: "Forbidden: Invalid origin" },
          { status: 403 }
        );
      }
    }
  }

  // ============================================
  // SESSION (EDGE-SAFE)
  // ============================================

  const session = getSessionFromCookie(request);
  const isAuthenticated = Boolean(session);
  const roles: string[] = session?.roles ?? [];
  const onboardingComplete = session?.onboardingComplete ?? true;

  const isApiRoute = pathname.startsWith("/api/");
  const isHomePage = pathname === "/";

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

    if (session?.onboardingIntent === "student") {
      redirectPath = "/onboarding/student/start";
    } else if (session?.onboardingIntent === "institution") {
      redirectPath = "/onboarding/institution/start";
    }

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ============================================
  // PUBLIC ROUTES
  // ============================================

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute && !AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // ============================================
  // AUTH ROUTES
  // ============================================

  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    let dashboardPath = "/dashboard";

    if (roles.includes("PLATFORM_ADMIN")) {
      dashboardPath = "/platform/dashboard";
    } else if (roles.includes("INSTITUTION_ADMIN")) {
      dashboardPath = "/dashboard/institution";
    } else if (roles.includes("STUDENT")) {
      dashboardPath = "/dashboard/student";
    } else if (roles.includes("TUTOR")) {
      dashboardPath = "/dashboard/tutor";
    }

    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // ============================================
  // PROTECTED ROUTES
  // ============================================

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // ============================================
  // API AUTH
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
}

// ============================================
// CONFIG
// ============================================

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
