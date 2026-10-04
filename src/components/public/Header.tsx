"use client";

import Link from "next/link";
import { useState } from "react";

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
    <header className="sticky top-0 z-50 transition-all duration-300 glass-surface border-b border-brand/20 text-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand Logo (home button) */}
        <Link href="/" className="group flex items-center">
          <img
            src="/images/logo.png"
            alt="Home"
            className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 xl:gap-8 text-[11px] font-semibold uppercase tracking-super-wide text-ink/80 lg:flex">
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

        {/* Inquire Button */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-full bg-brand px-6 py-2.5 text-[11px] font-semibold uppercase tracking-super-wide text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-hover hover:shadow-brand/40 hover:-translate-y-0.5"
          >
            Inquire
          </Link>
        </div>

        {/* Mobile Navigation Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-ink hover:text-brand focus:outline-none lg:hidden"
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

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="border-t border-brand/20 bg-paper px-6 py-6 lg:hidden">
          <nav className="flex flex-col space-y-3 text-xs font-semibold uppercase tracking-wider text-ink">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-black/5 py-1 transition-colors hover:text-brand"
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
