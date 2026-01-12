// app/(auth)/AuthBrandingPanel.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export function AuthBrandingPanel() {
  return (
    <aside className="relative hidden lg:flex flex-col overflow-hidden">
      {/* Aurora Background */}
      <div
        aria-hidden
        className="aurora-bg pointer-events-none absolute inset-0"
      />

      {/* Back Arrow (absolute, top-left) */}
      <Link
        href="/"
        aria-label="Go back home"
        className="
          absolute left-6 top-6 z-20
          inline-flex items-center gap-2
          text-sm font-medium text-muted-foreground
          transition-colors hover:text-foreground
        "
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Main Branding Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10 text-center">
        {/* Logo */}
        <Link href={'/'} className="relative h-35 w-35">
          <Image
            src="/brainy-logo-monochrome.png"
            alt="Brainy logo"
            fill
            priority
            className="object-contain invert dark:invert-0"
          />
        </Link>


        {/* Tagline */}
        <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
          Challenge your mind and expand your knowledge with engaging quizzes
          designed to help you learn, grow, and stay curious.
        </p>
      </div>

      {/* Footer */}
      <footer className="relative z-10 pb-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Brainy. All rights reserved.
      </footer>
    </aside>
  );
}
