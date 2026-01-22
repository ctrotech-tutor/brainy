// app/(platform)/layout.tsx
import type { Metadata } from "next";
import { AdminHeader } from "./_components/header";
import { AdminSidebar } from "./_components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasRole } from "@/lib/utils/roles";
import { BackgroundDecor } from "@/components/core/background-decor";

export const metadata: Metadata = {
  title: "Platform Administration - Brainy",
  description: "Manage the Brainy platform.",
};

export default async function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const isPlatformAdmin = await hasRole(user.id!, "PLATFORM_ADMIN");

  if (!isPlatformAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <BackgroundDecor variant="emerald" />

      {/* The Sidebar component will live on the left */}
      <AdminSidebar />

      {/* Main container, with a left margin for the sidebar */}
      {/* We set a max-height of the screen and make it a flex container */}
      <div className="relative flex h-screen flex-col sm:pl-14">
        
        {/* The Header component will live at the top of the main content */}
        {/* ADDED: `sticky top-0 z-30` to make the header stick */}
        <header className="sticky top-0 z-30 sm:py-4 sm:px-6">
          <AdminHeader />
        </header>

        {/* The actual page content will be rendered here */}
        {/* ADDED: `flex-1 overflow-y-auto` to make this area scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:pb-4">
          <div className="h-full w-full rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl p-6 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
