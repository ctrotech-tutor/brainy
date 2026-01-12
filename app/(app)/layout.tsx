// Remove "use client" - this is now a Server Component
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brain, LayoutDashboard, Settings, User } from "lucide-react";

// --- 1. Import your authentication and new UserNav component ---
import { validateRequest } from "@/lib/auth";
import { UserNav } from "@/components/auth/UserNav";

// A simple component for sidebar navigation links (no changes needed here)
const SidebarLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-primary"
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

// --- 2. Make the layout component async ---
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // --- 3. Fetch the user session on the server ---
  const { user } = await validateRequest();

  // --- 4. If no user, redirect to the login page ---
  if (!user) {
    return redirect("/login");
  }

  // --- 5. If user exists, render the layout ---
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      {/* --- Sidebar (Desktop) --- */}
      <aside className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Brain className="h-6 w-6 text-primary" />
              <span>Brainy</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <SidebarLink href="/dashboard/profile" icon={User} label="Profile" />
              <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" />
            </nav>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex flex-col">
        {/* --- Header --- */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex-1">
            {/* You can add a mobile sidebar trigger or search bar here */}
          </div>
          {/* --- 6. Render the UserNav client component with the user data --- */}
          <UserNav/>
        </header>

        {/* --- Page Content --- */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
