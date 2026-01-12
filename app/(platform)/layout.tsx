// app/(platform)/layout.tsx
import type { Metadata } from "next";
import { AdminHeader } from "./_components/header";
import { AdminSidebar } from "./_components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasRole } from "@/lib/utils/roles";

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
    <div className="min-h-screen w-full bg-muted/40">
      {/* The Sidebar component will live on the left */}
      <AdminSidebar />
      
      {/* Main content area, with a left margin to account for the sidebar */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {/* The Header component will live at the top of the main content */}
        <AdminHeader/>
        
        {/* The actual page content will be rendered here */}
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}
