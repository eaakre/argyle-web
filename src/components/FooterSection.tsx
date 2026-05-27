"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Typography } from "./ui/Typography";

export function FooterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left cursor-pointer md:cursor-default md:pointer-events-none mb-4"
      >
        <Typography variant="footer-header" noMargin>
          {title}
        </Typography>
        <ChevronDown
          className={`w-4 h-4 md:hidden transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        {children}
      </div>
    </div>
  );
}
