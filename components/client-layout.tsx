// components/client-layout.tsx
"use client";

import PageTransition from "./page-transition";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
