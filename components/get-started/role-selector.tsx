// components/get-started/role-selector.tsx
"use client";

import { motion } from "framer-motion";
// --- CHANGE 1: Import `selectableRoles` and the correct type ---
import { selectableRoles, roleData, type SelectableRole } from "@/lib/roles";

type RoleSelectorProps = {
  // --- CHANGE 2: Use the more specific `SelectableRole` type ---
  activeRole: SelectableRole;
  setActiveRole: (role: SelectableRole) => void;
};

export const RoleSelector = ({ activeRole, setActiveRole }: RoleSelectorProps) => {
  return (
    <div
      className="relative flex w-full justify-center rounded-full border bg-background p-1"
      style={{ boxShadow: "0px 4px 12px hsla(var(--foreground) / 0.08)" }}
    >
      {/* --- CHANGE 3: Map over `selectableRoles` instead of all roles --- */}
      {selectableRoles.map((role) => (
        <button
          key={role}
          onClick={() => setActiveRole(role)}
          className="relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 sm:px-6 sm:py-2.5 sm:text-base text-red-500"
          style={{
            color:
              activeRole === role
                ? "hsl(var(--primary-foreground))"
                : "hsl(var(--accent-foreground))",
          }}
        >
          {roleData[role].title}
        </button>
      ))}

      <motion.div
        layoutId="active-role-pill"
        className="absolute inset-0 z-0 h-full rounded-full bg-primary"
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        style={{
          // This dynamic calculation now correctly uses the length of `selectableRoles`
          width: `${100 / selectableRoles.length}%`,
          left: `${(selectableRoles.indexOf(activeRole) / selectableRoles.length) * 100}%`,
        }}
      />
    </div>
  );
};
