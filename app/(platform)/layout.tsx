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
  description: "Manage the Brainy platform, institutions, and users.",
};

export default async function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const isPlatformAdmin = await hasRole(user.id, 'PLATFORM_ADMIN');

  if (!isPlatformAdmin) {
    redirect('/unauthorized');
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <BackgroundDecor variant="emerald" />

      {/* The Sidebar component will live on the left */}
      <AdminSidebar />

      {/* Main content area, with a left margin to account for the sidebar */}
      <div className="relative z-10 flex flex-col sm:gap-4 sm:py-4 sm:pl-14 min-h-screen">
        {/* The Header component will live at the top of the main content */}
        <AdminHeader />

        {/* The actual page content will be rendered here */}
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          <div className="h-full w-full rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl p-6 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
