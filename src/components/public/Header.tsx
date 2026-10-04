import Link from "next/link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events & Workshops" },
  { href: "/news", label: "News" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="BTRC logo" className="h-9 w-auto" />
          <span className="text-sm font-semibold">Bamenda Tech Research Center</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-widest text-white/90 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full border border-white/40 px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors hover:border-brand hover:text-brand"
        >
          Inquire
        </Link>
      </div>
    </header>
  );
}
