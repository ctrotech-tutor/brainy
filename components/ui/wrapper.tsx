// components/ui/wrapper.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Wrapper = React.forwardRef<HTMLDivElement, WrapperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Wrapper.displayName = "Wrapper";

export { Wrapper };
