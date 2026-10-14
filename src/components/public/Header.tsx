"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/programs", label: "Programs" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events & Workshops" },
  { href: "/news", label: "News" },
  { href: "/downloads", label: "Resources" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 glass-surface border-b border-brand/20 text-content">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand Logo (home button) */}
        <Link href="/" className="group flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="UNMASK"
            className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-bold text-lg uppercase tracking-super-wide text-brand transition-colors group-hover:text-brand-hover">UNMASK</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 xl:gap-8 text-[11px] font-semibold uppercase tracking-super-wide text-content/80 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="relative py-1 transition-colors duration-200 hover:text-brand after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all hover:after:w-full"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Inquire Button & Theme Toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/contact"
            className="rounded-full bg-brand px-6 py-2.5 text-[11px] font-semibold uppercase tracking-super-wide text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-hover hover:shadow-brand/40 hover:-translate-y-0.5"
          >
            Inquire
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-content hover:text-brand focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="border-t border-brand/20 bg-surface px-6 py-6 lg:hidden">
          <nav className="flex flex-col space-y-3 text-xs font-semibold uppercase tracking-wider text-content">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-edge py-1 transition-colors hover:text-brand"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-full bg-brand py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

