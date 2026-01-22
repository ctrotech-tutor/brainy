// app/(platform)/_constants/nav-links.ts

import {
  LayoutDashboard,
  Building2,
  Users,
  UserPlus,
  Scale,
  ScrollText,
  FileText,
  Mails,
  Gauge,
  Inbox,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  key?: "pendingInstitutions" | "unrepliedLeads" | "unreadNotifications"; // For notification counts
}

// Define the navigation links for the sidebar and mobile drawer
export const PLATFORM_NAV_LINKS: NavLink[] = [
  { href: "/platform/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/platform/inbox", label: "Inbox", icon: Inbox, key: "unreadNotifications" },
  { href: "/platform/institutions", label: "Institutions", icon: Building2, key: "pendingInstitutions" },
  { href: "/platform/users", label: "Users", icon: Users },
  { href: "/platform/leads", label: "Leads", icon: UserPlus, key: "unrepliedLeads" },
  { href: "/platform/legal", label: "Legal", icon: Scale },
  { href: "/platform/audit-logs", label: "Audit Logs", icon: ScrollText },
  { href: "/platform/blog", label: "Blog Posts", icon: FileText },
  { href: "/platform/newsletter", label: "Newsletter", icon: Mails },
  { href: "/platform/monitoring", label: "System Monitoring", icon: Gauge },
];

export const SETTINGS_NAV_LINK: NavLink = {
  href: "/platform/settings",
  label: "Settings",
  icon: Settings,
};
