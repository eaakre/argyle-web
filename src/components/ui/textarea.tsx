import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Layout & Sizing
        "flex field-sizing-content min-h-16 w-full",
        // Background & Colors
        "bg-bg-primary dark:bg-input/30",
        "text-base md:text-sm",
        "placeholder:text-text-primary/50",
        // Border & Shape
        "border border-input rounded-md",
        "shadow-xs",
        // Spacing
        "px-3 py-2",
        // Focus States
        "outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
        // Error States
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "dark:aria-invalid:ring-destructive/40",
        // Interaction & Animation
        "transition-[color,box-shadow]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
