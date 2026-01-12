import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestOrigin } from "lucia";
import { validateSessionInMiddleware } from "@/lib/auth";

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
// proxy
// ============================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // CSRF PROTECTION (for non-GET requests to API)
  // ============================================
  if (request.method !== "GET") {
    // Skip CSRF for public API routes
    const isPublicApiRoute = API_PUBLIC_ROUTES.some(route => pathname.startsWith(route));
    
    if (!isPublicApiRoute && pathname.startsWith("/api/")) {
      const originHeader = request.headers.get("Origin");
      const hostHeader = request.headers.get("Host");
      
      if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
        return NextResponse.json(
          { error: "Forbidden: Invalid origin" },
          { status: 403 }
        );
      }
    }
  }

  // ============================================
  // CHECK AUTHENTICATION STATUS
  // ============================================
  
  const sessionCookie = request.cookies.get("brainy-session");
  const { user, session, roles } = await validateSessionInMiddleware(sessionCookie?.value || "");
  const isAuthenticated = !!session;

  // ============================================
  // ONBOARDING ENFORCEMENT
  // ============================================
  
  const isOnboardingRoute = ONBOARDING_ROUTES.some(route => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith("/api/");
  const isHomePage = pathname === "/";

  if (isAuthenticated && !user?.onboardingComplete && !isOnboardingRoute && !isApiRoute && !isHomePage) {
    // User is logged in but hasn't finished onboarding. 
    // Force them to their onboarding path.
    let redirectPath = "/onboarding/choose-path";
    if (user?.onboardingIntent === "student") {
      redirectPath = "/onboarding/student/start";
    } else if (user?.onboardingIntent === "institution") {
      redirectPath = "/onboarding/institution/start";
    }
    
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // ============================================
  // PUBLIC ROUTES - Allow everyone
  // ============================================
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute && !AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // ============================================
  // AUTH ROUTES - Redirect to dashboard if already logged in
  // ============================================
  
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isAuthRoute && isAuthenticated) {
    // Determine the best dashboard based on roles
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
  // PROTECTED ROUTES - Require authentication
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
  // DASHBOARD REDIRECT - Route /dashboard to role base
  // ============================================

  if (pathname === "/dashboard" && isAuthenticated) {
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
    
    if (dashboardPath !== "/dashboard") {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  // ============================================
  // API ROUTES - Check authentication
  // ============================================
  
  if (isApiRoute && !isAuthenticated) {
    const isPublicApiRoute = API_PUBLIC_ROUTES.some(route => pathname.startsWith(route));
    
    if (!isPublicApiRoute) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// ============================================
// proxy CONFIG
// ============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};