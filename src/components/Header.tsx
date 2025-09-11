"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronRight, ChevronDown } from "lucide-react";
import Drawer from "./ui/Drawer";
import { navLinks, NavLink } from "../types/navLink";
import Image from "next/image";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`bg-bg-primary sticky top-0 z-50 transition-transform duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-6xl md:px-20 mx-auto px-4 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <Image
              src="/Argyle.png"
              alt="Argyle Home"
              width={100}
              height={100}
              className="w-[100px] md:w-[100px] object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks desktop />
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            aria-label="Open Navigation Menu"
            onClick={() => setIsOpen(true)}
          >
            <Menu width={40} height={40} className="text-accent" />
          </button>
        </div>
        <div className="bg-accent w-full h-10"></div>
      </nav>

      <div className="h-0 bg-gradient-to-r from-transparent via-secondary-foreground/20 to-transparent"></div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        direction="right"
      >
        <nav className="space-y-4 mt-8">
          <div className="flex flex-col divide-y divide-secondary/20 gap-y-5">
            <NavLinks mobile onClick={() => setIsOpen(false)} />
          </div>
        </nav>
      </Drawer>
    </>
  );
}

function NavLinks({
  onClick,
  desktop,
  mobile,
}: {
  onClick?: () => void;
  desktop?: boolean;
  mobile?: boolean;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (desktop) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setOpenDropdown(label);
    }
  };

  const handleMouseLeave = () => {
    if (desktop) {
      const timeout = setTimeout(() => {
        setOpenDropdown(null);
      }, 150); // Small delay to allow moving to dropdown
      setHoverTimeout(timeout);
    }
  };

  const handleDropdownMouseEnter = () => {
    if (desktop && hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  return (
    <>
      {navLinks.map((link: NavLink) => {
        if (link.children) {
          // Parent link with dropdown/accordion
          return (
            <div key={link.label} className="relative">
              {/* Parent */}
              <button
                className="flex w-full justify-between items-center py-5 md:py-0 hover:text-primary-hover"
                onClick={() =>
                  mobile
                    ? setOpenDropdown(
                        openDropdown === link.label ? null : link.label
                      )
                    : undefined
                }
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                {link.label}
                {desktop ? (
                  <ChevronDown
                    className={`ml-2 transition-transform ${
                      openDropdown === link.label ? "rotate-180" : ""
                    }`}
                  />
                ) : (
                  <ChevronRight
                    className={`ml-2 transition-transform ${
                      openDropdown === link.label ? "rotate-90" : ""
                    }`}
                  />
                )}
              </button>

              {/* Desktop Dropdown */}
              {desktop && openDropdown === link.label && (
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 z-50 min-w-[200px] w-max"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="py-2">
                    {link.children.map((child, index) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={`block px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          index !== link.children!.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                        onClick={onClick}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Accordion */}
              {mobile && openDropdown === link.label && (
                <div className="pl-4 mt-2 space-y-2">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block py-2"
                      onClick={onClick}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // Simple link
        return (
          <Link
            key={link.label}
            href={link.href!}
            className="flex w-full justify-between md:w-auto hover:text-primary-hover py-5 md:py-0"
            onClick={onClick}
          >
            {link.label}
            {mobile && <ChevronRight />}
          </Link>
        );
      })}
    </>
  );
}
