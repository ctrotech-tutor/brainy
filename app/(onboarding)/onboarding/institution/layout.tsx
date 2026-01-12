// app/(onboarding)/layout.tsx
import Link from "next/link";
import { Brain } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The main container with the subtle background pattern
    <div className="flex min-h-screen flex-col bg-background bg-[radial-gradient(hsl(var(--muted))_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* A simple header for the onboarding flow */}
      <header className="hidden sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <Wrapper className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Brainy</span>
          </Link>
          {/* We can add a progress bar or step indicator here later */}
          <div className="text-sm text-muted-foreground">
            Account Setup
          </div>
        </Wrapper>
      </header>

      {/* The main content area where our onboarding steps will be rendered. */}
      <main className="flex-1">
        {children}
      </main>
      
    </div>
  );
}
