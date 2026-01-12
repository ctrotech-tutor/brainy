// app/get-started/layout.tsx
import Link from "next/link";
import { Brain } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The main container with a subtle background pattern for a premium feel
    <div className="flex min-h-screen flex-col bg-background bg-[radial-gradient(hsl(var(--muted))_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* --- CORRECTED HEADER --- */}
      {/* This is a simple header, NOT the full site Navbar. */}
      {/* It provides branding and an exit path without distracting the user. */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <Wrapper className="flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Brainy</span>
          </Link>
        </Wrapper>
      </header>

      {/* The main content area where our interactive page will live. */}
      {/* `flex-1` ensures it takes up all available vertical space. */}
      {/* The content inside will be centered by the page component itself. */}
      <main className="flex-1">
        {children}
      </main>

      {/* --- CORRECTED: NO FOOTER --- */}
      {/* A focused onboarding flow should not have a footer, which can distract the user. */}
      
    </div>
  );
}
