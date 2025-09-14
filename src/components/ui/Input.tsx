import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout & Sizing
        "flex h-9 w-full min-w-0",

        // Background & Colors
        "bg-bg-primary dark:bg-input/30",
        "text-base md:text-sm",
        "placeholder:text-text-primary/50",

        // Selection Styles
        "selection:bg-bg-primary selection:text-text-primary",

        // Border & Shape
        "border border-input rounded-md",
        "shadow-xs",

        // Spacing
        "px-3 py-1",

        // Focus States
        "outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",

        // Error States
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "dark:aria-invalid:ring-destructive/40",

        // File Input Styles
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent",
        "file:text-sm file:font-medium file:text-text-primary",

        // Interaction & Animation
        "transition-[color,box-shadow]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        className
      )}
      {...props}
    />
  );
}

export { Input };
