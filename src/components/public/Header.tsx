"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
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
    <header className="sticky top-0 z-50 transition-all duration-300 glass-surface-dark border-b border-brand/20 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 border border-brand/40 text-brand font-mono font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-xs tracking-super-wide font-bold uppercase text-white group-hover:text-brand transition-colors">
              Bamenda Tech
            </span>
            <span className="text-[10px] font-mono text-brand font-semibold tracking-widest uppercase">
              Research Center
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 xl:gap-8 text-[11px] font-semibold uppercase tracking-super-wide text-white/90 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="transition-colors duration-200 hover:text-brand relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand hover:after:w-full after:transition-all"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Status Indicator & Inquire Button */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-brand/30 text-brand text-[10px] font-mono tracking-wider font-semibold">
            <span className="h-2 w-2 rounded-full bg-brand animate-ping"></span>
            <span>R&D ONLINE</span>
          </div>
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
          className="lg:hidden p-2 text-white hover:text-brand focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="lg:hidden border-t border-brand/20 bg-ink-light px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-xs font-semibold uppercase tracking-wider text-white">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="hover:text-brand py-1 border-b border-white/5 transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 flex justify-between items-center">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-full bg-brand py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
