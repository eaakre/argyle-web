import * as React from "react";

import { cn } from "@/lib/utils";

function Dropdown({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="dropdown"
      className={cn(
        // Layout & Sizing
        "w-full",

        // Background & Colors
        "bg-bg-primary",
        "text-sm",

        // Border & Shape
        "border border-input rounded-md",
        "ring-offset-background",

        // Spacing
        "px-3 py-2",

        // Focus States
        "focus:outline-none",
        "focus:ring-[1px] focus:ring-offset-1",

        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Dropdown };
