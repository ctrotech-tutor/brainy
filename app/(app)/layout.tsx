// app/(app)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brain } from "lucide-react";
import { validateRequest } from "@/lib/auth";
import { UserNav } from "@/components/auth/UserNav";
import { BackgroundDecor } from "@/components/core/background-decor";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col">
      <BackgroundDecor variant="emerald" />

      {/* Slim, Minimalist Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/50 backdrop-blur-3xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group transition-all">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <span className="font-black tracking-tighter text-lg uppercase italic group-hover:text-primary transition-colors">
              Brainy.
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main content centered for standard dashboard experience */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      {/* System Status Footer */}
      <footer className="w-full border-t border-white/5 py-4">
        <div className="container flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Neural Link: Secure
        </div>
      </footer>
    </div>
  );
}
