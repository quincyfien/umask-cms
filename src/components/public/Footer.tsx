import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { getOrganization } from "@/lib/organization";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services & Labs" },
  { href: "/programs", label: "Programs & Grants" },
  { href: "/projects", label: "Research Projects" },
];

const RESOURCE_LINKS = [
  { href: "/events", label: "Events & Workshops" },
  { href: "/news", label: "News & Publications" },
  { href: "/downloads", label: "Resources & Docs" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { label: "GH", href: "https://github.com" },
  { label: "X", href: "https://x.com" },
  { label: "IN", href: "https://linkedin.com" },
  { label: "YT", href: "https://youtube.com" },
];

export default async function Footer() {
  const org = await getOrganization();
  const socials =
    org.socials.length > 0
      ? org.socials
      : SOCIALS.map((s) => ({ label: s.label, url: s.href }));

  return (
    <footer className="border-t border-brand/20 bg-card text-content">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Newsletter */}
        <div className="mb-14 rounded-2xl border border-brand/20 bg-surface p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Subscribe to Newsletter</h3>
              <p className="mt-2 text-sm text-muted">
                Receive research briefs, upcoming events, and fellowship opportunities directly in your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Link Columns */}
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <img src="/images/logo.png" alt="UNMASK" className="h-10 w-auto object-contain" />
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Advancing practical scientific engineering, technological research, and innovation .
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted transition-colors hover:text-brand">
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
            <ul className="mt-4 space-y-2 text-sm">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Campus
            </h4>
            <p className="mt-4 text-sm text-muted">{org.address || "Bambili Campus, NW Region, Cameroon"}</p>
            <p className="mt-2 text-sm">
              <a href={`mailto:${org.email || "inquiries@btrc-center.org"}`} className="font-mono text-brand hover:underline">
                {org.email || "inquiries@btrc-center.org"}
              </a>
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-8 min-w-8 items-center justify-center rounded-full border border-brand/30 px-2 text-[10px] font-mono font-semibold text-muted transition-all hover:border-brand hover:bg-brand/10 hover:text-brand"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-edge pt-6 text-xs text-muted md:flex-row">
          <p>© 2026 UNMASK. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-brand">
              Privacy Policy
            </Link>
            <Link href="/contact" className="transition-colors hover:text-brand">
              Contact Us
            </Link>
            <Link href="/admin/login" className="font-mono text-muted transition-colors hover:text-brand">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

