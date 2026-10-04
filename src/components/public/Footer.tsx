import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About BTRC" },
  { href: "/services", label: "Services & Labs" },
  { href: "/programs", label: "Programs & Grants" },
  { href: "/projects", label: "Research Projects" },
  { href: "/events", label: "Events & Workshops" },
  { href: "/news", label: "News & Publications" },
  { href: "/downloads", label: "Resources & Docs" },
];

const SOCIALS = [
  { label: "GH", href: "https://github.com" },
  { label: "X", href: "https://x.com" },
  { label: "IN", href: "https://linkedin.com" },
  { label: "YT", href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-300 border-t border-brand/20 relative pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Newsletter Subscription Banner */}
        <div className="relative -top-16 rounded-2xl aristocratic-card p-8 md:p-10 text-white shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-brand/10 blur-3xl"></div>
          <div className="grid gap-6 md:grid-cols-2 md:items-center relative z-10">
            <div>
              <span className="text-[10px] font-mono tracking-super-wide text-brand uppercase font-semibold">
                STAY INFORMED
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                Subscribe to BTRC Research Intelligence
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Receive curated research briefs, upcoming events, and fellowship opportunities directly in your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Core Footer Link Columns */}
        <div className="grid gap-10 pb-12 pt-2 md:grid-cols-4 border-b border-brand/10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/20 border border-brand/40 text-brand font-mono font-bold text-lg">
                B
              </div>
              <span className="font-bold text-white text-sm uppercase tracking-wider">
                Bamenda Tech Research Center
              </span>
            </div>
            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              Advancing practical scientific engineering, technological research, and innovation in Bamenda, Cameroon.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              {QUICK_LINKS.slice(0, 4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-300 hover:text-brand transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Research Commons
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              {QUICK_LINKS.slice(4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-300 hover:text-brand transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Campus Headquarters
            </h4>
            <p className="mt-4 text-xs font-semibold text-white">
              Bamenda Tech Research Center (BTRC)
            </p>
            <p className="mt-1 text-xs text-gray-400">Bambili Campus, NW Region, Cameroon</p>
            <p className="mt-2 text-xs">
              <a href="mailto:inquiries@btrc-center.org" className="text-brand hover:underline font-mono">
                inquiries@btrc-center.org
              </a>
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/30 text-[10px] font-mono font-semibold text-gray-300 hover:border-brand hover:bg-brand/10 hover:text-brand transition-all"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-footer Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-gray-400 md:flex-row">
          <p>© 2026 Bamenda Tech Research Center (BTRC). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-brand transition-colors">
              Contact Us
            </Link>
            <Link href="/admin/login" className="hover:text-brand text-gray-500 font-mono transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
