import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events and Workshops" },
  { href: "/news", label: "News" },
];

const SOCIALS = [
  { label: "GH", href: "#" },
  { label: "X", href: "#" },
  { label: "IN", href: "#" },
  { label: "YT", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-paper text-gray-700">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative -top-10 rounded-2xl bg-ink p-8 text-white shadow-xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-xl font-bold">Sign up for our newsletter</h3>
              <p className="mt-2 text-sm text-gray-400">
                Stay informed about research, programs and events.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-10 pb-12 pt-4 md:grid-cols-3">
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-900">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-900">
              Contact Info
            </h4>
            <p className="mt-4 text-sm font-semibold text-gray-900">
              Bamenda Tech Research Center (BTRC)
            </p>
            <p className="mt-1 text-sm text-gray-600">Bambili, Cameroon</p>
            <p className="mt-2 text-sm">
              <a href="mailto:inquiries@btrc-center.org" className="text-brand hover:underline">
                inquiries@btrc-center.org
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-900">
              Follow Us
            </h4>
            <div className="mt-4 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-gray-600 hover:border-brand hover:text-brand"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 py-6 text-xs text-gray-500 md:flex-row">
          <p>© 2026 Bamenda Tech Research Center (BTRC). All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand">
              Privacy Policy
            </Link>
            <span>Terms of Service</span>
            <span>Open Research Commons</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
