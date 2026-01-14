// components/get-started/role-selector.tsx
"use client";

import { motion } from "framer-motion";
// --- CHANGE 1: Import `selectableRoles` and the correct type ---
import { selectableRoles, roleData, type SelectableRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

type RoleSelectorProps = {
  // --- CHANGE 2: Use the more specific `SelectableRole` type ---
  activeRole: SelectableRole;
  setActiveRole: (role: SelectableRole) => void;
};

export const RoleSelector = ({ activeRole, setActiveRole }: RoleSelectorProps) => {
  return (
    <div className="relative flex w-full justify-center rounded-2xl border border-white/5 bg-white/2 backdrop-blur-md p-1 shadow-2xl">
      {selectableRoles.map((role) => (
        <button
          key={role}
          onClick={() => setActiveRole(role)}
          className={cn(
            "relative z-10 flex-1 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 sm:px-6 sm:py-4 sm:text-xs outline-none",
            activeRole === role ? "text-primary-foreground" : "text-muted-foreground/60 hover:text-muted-foreground"
          )}
        >
          {roleData[role].title}
        </button>
      ))}

      <motion.div
        layoutId="active-role-pill"
        className="absolute inset-1 z-0 rounded-xl bg-primary shadow-lg shadow-primary/20"
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        style={{
          width: `calc(${100 / selectableRoles.length}% - 4px)`,
          left: `calc(${(selectableRoles.indexOf(activeRole) / selectableRoles.length) * 100}% + 2px)`,
        }}
      />
    </div>
  );
};
