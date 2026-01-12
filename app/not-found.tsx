import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/ui/wrapper";
import { BrokenLinkIcon } from "@/components/icons/BrokenLinkIcon"; // Import our custom icon

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Animated Gradient Background for a premium feel */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-blob rounded-full bg-primary/10 opacity-50 blur-3xl filter" />
        <div className="animation-delay-4000 absolute bottom-1/4 right-1/4 h-96 w-96 animate-blob rounded-full bg-accent/10 opacity-50 blur-3xl filter" />
      </div>

      <Wrapper className="flex min-h-screen flex-col items-center justify-center text-center">
        <main className="flex flex-col items-center">
          {/* Custom SVG Icon */}
          <BrokenLinkIcon className="mb-6 h-24 w-24 text-muted-foreground/50" />

          {/* Status and Message */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Oops! Page Not Found
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            It seems the page you’re looking for has been moved or doesn’t
            exist. Let’s get you back on track.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </main>

        {/* Branding Footer */}
        <footer className="absolute bottom-8">
          <p className="text-sm text-muted-foreground">
            Brainy • A Smarter Way to Learn
          </p>
        </footer>
      </Wrapper>
    </div>
  );
}
