import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            // This will be implemented in the main auth.ts to avoid edge runtime issues
            return null;
        },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/onboarding/choose-path",
    error: "/auth/login", // Redirect to login on error
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiRoute = nextUrl.pathname.startsWith("/api");
      const isAuthRoute = nextUrl.pathname.startsWith("/auth");
      const isPublicRoute = ["/", "/about", "/contact"].includes(nextUrl.pathname);

      if (isApiRoute || isPublicRoute) return true;
      if (isAuthRoute) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
