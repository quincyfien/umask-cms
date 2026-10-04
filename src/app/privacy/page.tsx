import Link from "next/link";

const SECTIONS = [
  {
    id: "01",
    title: "Data We Collect",
    content: `BTRC collects only the personal data necessary to deliver requested services: applicant details (name, email, phone, institution, motivation) for program applications; contact messages submitted via our inquiry form; newsletter subscription email addresses; event registration details including attendee name and email; and staff account credentials managed internally.`,
  },
  {
    id: "02",
    title: "How We Use Your Data",
    content: `We use your data to: process program and fellowship applications; respond to contact inquiries; send newsletter updates to subscribers who have explicitly opted in; manage event registration and capacity; and administer staff access to our CMS control panel. We do not sell or share personal data with third parties for marketing purposes.`,
  },
  {
    id: "03",
    title: "Data Retention Schedules",
    content: `Per our SRS v5 Data Retention Policy: Contact messages are retained for 30 days after resolution. Event registrations are retained for 12 months after the event concludes. Applicant data is deleted 6 months after the associated program closes. Newsletter subscriptions are retained until an active unsubscribe request is processed. Staff account data is retained for the duration of employment and deleted within 30 days of departure.`,
  },
  {
    id: "04",
    title: "Third-Party Processors",
    content: `We utilize the following processors: Cloudflare (DDoS protection, edge routing and CDN); AWS IaaS af-south-1 Cape Town (server infrastructure and transactional email via SES); Plausible Analytics (privacy-first, cookie-free page analytics with no personal data collection). All processors have executed Data Processing Agreements compliant with applicable data protection legislation.`,
  },
  {
    id: "05",
    title: "Data Security",
    content: `Personal data is encrypted in transit via TLS 1.2+ and at rest via AES-256. Passwords are hashed using Argon2id. Access to personal data is restricted to authorized staff with the minimum required permissions. Our infrastructure undergoes periodic security reviews aligned with our threat model documented in BTRC SRS v5.`,
  },
  {
    id: "06",
    title: "Your Rights & Data Requests",
    content: `You have the right to access, correct, or request deletion of your personal data held by BTRC. To submit a data request, please contact us using the form on our Contact page or email us directly. We will process verified requests within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-ink text-paper min-h-screen">
      <section className="relative py-16 border-b border-brand/20 bg-gradient-to-b from-ink-light to-ink">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold">LEGAL DISCLOSURE</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">Privacy Policy</h1>
          <p className="mt-3 text-gray-400 text-sm font-mono">
            Effective date: 01 January 2026 · Version aligned with BTRC SRS v5.0
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.id} className="aristocratic-card p-8 rounded-2xl border-l-4 border-brand">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-brand font-semibold">{s.id}</span>
                <h2 className="text-lg font-bold text-white">{s.title}</h2>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{s.content}</p>
            </div>
          ))}

          <div className="aristocratic-card p-8 rounded-2xl text-center">
            <p className="text-sm text-gray-300 mb-4">
              For data access requests or privacy-related questions, please use our inquiry form.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors"
            >
              Submit a Data Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
