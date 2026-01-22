// config/nav.ts
export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[]; // For dropdowns
};

export const navLinks: NavItem[] = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  {
    label: "Audience",
    href: "#audience", // Main link scrolls to the start of the group
    children: [
      { href: "#for-students", label: "For Students" },
      { href: "#for-tutors", label: "For Tutors" },
      { href: "#for-institutions", label: "For Institutions" },
    ],
  },
  { href: "#security", label: "Security" },
  { href: "#why-brainy", label: "Why Brainy?" },
];
