// components/main/icons/BrokenLinkIcon.tsx
import React from "react";

export const BrokenLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="120"
    height="120"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
    {/* The "break" in the middle */}
    <line x1="8" y1="2" x2="16" y2="22" stroke="hsl(var(--destructive ))" strokeWidth="1.5" />
  </svg>
);
