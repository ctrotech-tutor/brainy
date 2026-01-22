import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      onboardingComplete: boolean;
      onboardingIntent: string | null;
    } & DefaultSession["user"]
  }

  interface User {
    onboardingComplete?: boolean;
    onboardingIntent?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    onboardingComplete: boolean;
    onboardingIntent: string | null;
  }
}
