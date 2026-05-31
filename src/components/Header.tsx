"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ChevronRight, ChevronDown, X } from "lucide-react";
import Drawer from "./ui/Drawer";
import { SanityNavLink } from "@/lib/sanity";
import Image from "next/image";
import AnnouncementBar, { Announcement } from "./ui/AnnouncementBar";

type Props = {
  announcements?: Announcement[];
  navLinks?: SanityNavLink[];
};

export function Header({ announcements = [], navLinks = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [desktopOpenDropdown, setDesktopOpenDropdown] = useState<string | null>(
    null,
  );
  const [lockedDropdown, setLockedDropdown] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleDesktopMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setDesktopOpenDropdown(label);
  };

  const handleDesktopMouseLeave = () => {
    if (lockedDropdown) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setDesktopOpenDropdown(null);
    }, 250);
  };

  const handleDesktopClick = (label: string) => {
    const isLocking = lockedDropdown !== label;
    setLockedDropdown(isLocking ? label : null);
    setDesktopOpenDropdown(isLocking ? label : null);
  };

  const closeDropdown = () => {
    setLockedDropdown(null);
    setDesktopOpenDropdown(null);
  };

  return (
    <>
      <div
        className={`sticky top-0 z-50 transition-transform duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* nav scoped to logo row only so top-full on the panel lands here, above the bars */}
        <nav className="relative bg-bg-primary">
          <div className="max-w-6xl lg:px-20 mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold">
              <Image
                src="/logo.png"
                alt="Argyle Home"
                width={100}
                height={100}
                className="w-[100px] md:w-[100px] shrink-0 object-contain logo-image"
              />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLinks
                links={navLinks}
                desktop
                desktopOpenDropdown={desktopOpenDropdown}
                onDesktopMouseEnter={handleDesktopMouseEnter}
                onDesktopMouseLeave={handleDesktopMouseLeave}
                onDesktopClick={handleDesktopClick}
                onCloseDropdown={closeDropdown}
              />
            </div>

            {/* Mobile Button */}
            <button
              className="md:hidden"
              aria-label="Open Navigation Menu"
              onClick={() => setIsOpen(true)}
            >
              <Menu width={40} height={40} className="cursor-pointer" />
            </button>
          </div>
        </nav>

        {announcements && announcements.length ? (
          <div className="bg-secondary w-full overflow-hidden h-10">
            <AnnouncementBar announcements={announcements} />
          </div>
        ) : (
          <div className="bg-secondary w-full h-2"></div>
        )}

        <div className="bg-stripe w-full h-4"></div>
      </div>

      <div className="h-0 bg-gradient-to-r from-transparent via-secondary-foreground/20 to-transparent"></div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        direction="right"
        hideCloseButton
      >
        {/* Mini header matching the site header */}
        <div className="-mx-6 -mt-6">
          <div className="flex items-center justify-between px-4 bg-bg-primary">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image
                src="/logo.png"
                alt="Argyle Home"
                width={80}
                height={80}
                className="w-[80px] object-contain logo-image"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="p-2 hover:bg-primary/10 rounded transition-colors"
            >
              <X size={24} className="text-text-primary" />
            </button>
          </div>
          <div className="h-[3px] bg-secondary" />
          <div className="h-3 bg-stripe" />
        </div>

        <nav className="-mx-6 mt-4">
          <NavLinks links={navLinks} mobile onClick={() => setIsOpen(false)} />
        </nav>
      </Drawer>
    </>
  );
}

function NavLinks({
  links,
  onClick,
  desktop,
  mobile,
  desktopOpenDropdown,
  onDesktopMouseEnter,
  onDesktopMouseLeave,
  onDesktopClick,
  onCloseDropdown,
}: {
  links: SanityNavLink[];
  onClick?: () => void;
  desktop?: boolean;
  mobile?: boolean;
  desktopOpenDropdown?: string | null;
  onDesktopMouseEnter?: (label: string) => void;
  onDesktopMouseLeave?: () => void;
  onDesktopClick?: (label: string) => void;
  onCloseDropdown?: () => void;
}) {
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(
    null,
  );

  return (
    <>
      {links.map((link) => {
        if (link.children) {
          const isOpen = desktop
            ? desktopOpenDropdown === link.label
            : mobileOpenDropdown === link.label;

          return (
            <div key={link.label}>
              <button
                className={
                  desktop
                    ? "flex items-center hover:text-text-primary-hover"
                    : `flex w-full items-center justify-between px-5 py-4 font-semibold text-base border-b border-secondary/15 transition-colors ${
                        isOpen
                          ? "bg-primary/5 text-text-primary border-l-[3px] border-l-secondary pl-[17px]"
                          : ""
                      }`
                }
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={() => {
                  if (mobile) setMobileOpenDropdown(isOpen ? null : link.label);
                  else onDesktopClick?.(link.label);
                }}
                onMouseEnter={() =>
                  desktop && onDesktopMouseEnter?.(link.label)
                }
                onMouseLeave={() => desktop && onDesktopMouseLeave?.()}
              >
                {link.label}
                {desktop ? (
                  <ChevronDown
                    className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                ) : (
                  <ChevronRight
                    className={`ml-2 transition-[transform,opacity] duration-200 ${
                      isOpen
                        ? "rotate-90 text-secondary opacity-100"
                        : "opacity-40"
                    }`}
                  />
                )}
              </button>

              {/* Desktop full-width dropdown panel — inline for correct tab order */}
              {desktop && isOpen && (
                <div
                  className="absolute top-full left-0 right-0 bg-bg-primary border-t-[3px] border-secondary shadow-lg z-50"
                  onMouseEnter={() => onDesktopMouseEnter?.(link.label)}
                  onMouseLeave={onDesktopMouseLeave}
                >
                  <div className="max-w-6xl lg:px-20 mx-auto px-4 py-5">
                    <p className="text-base font-bold uppercase tracking-[2px] text-text-primary opacity-90 mb-3">
                      {link.label}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="group flex items-center gap-4 rounded-sm px-3 py-2.5 font-medium transition-colors duration-150 hover:bg-primary/5 hover:text-text-primary"
                          onClick={onCloseDropdown}
                        >
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile accordion sub-items */}
              {mobile && isOpen && (
                <div className="bg-bg-secondary border-b border-secondary/15">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="flex items-center gap-2.5 border-b border-black/[0.04] px-6 py-2.5 text-sm font-medium text-text-secondary last:border-b-0"
                      onClick={onClick}
                    >
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={link.label}
            href={link.href!}
            className={
              desktop
                ? "hover:text-primary-hover"
                : "flex w-full items-center px-5 py-4 font-semibold text-base border-b border-secondary/15"
            }
            onClick={onClick}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
