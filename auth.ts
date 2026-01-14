import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import authConfig from "./auth.config";
import { users, userRoles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/utils/auth";
import Credentials from "next-auth/providers/credentials";

export const { 
    handlers: { GET, POST }, 
    auth, 
    signIn, 
    signOut 
} = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers.filter(p => p.id !== "credentials"),
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, (credentials.email as string).toLowerCase()))
          .limit(1);

        if (!user || !user.hashedPassword) return null;

        const isValid = await verifyPassword(user.hashedPassword, credentials.password as string);

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          onboardingComplete: user.onboardingComplete,
          onboardingIntent: user.onboardingIntent,
        };
      },
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.onboardingComplete = (user as any).onboardingComplete;
        token.onboardingIntent = (user as any).onboardingIntent;

        // Fetch roles
        const dbRoles = await db
          .select({ role: userRoles.role })
          .from(userRoles)
          .where(eq(userRoles.userId, user.id!));
        token.roles = dbRoles.map(r => r.role);
      }

      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).onboardingComplete = token.onboardingComplete;
        (session.user as any).onboardingIntent = token.onboardingIntent;
        (session.user as any).roles = token.roles;
      }
      return session;
    },
  },
});
