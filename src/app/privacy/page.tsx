import Link from "next/link";

const SECTIONS = [
  {
    id: "01",
    title: "Data We Collect",
    content: `We collect only the personal data necessary to deliver requested services: applicant details (name, email, phone, institution, motivation) for program applications; contact messages submitted via our inquiry form; newsletter subscription email addresses; event registration details including attendee name and email; and staff account credentials managed internally.`,
  },
  {
    id: "02",
    title: "How We Use Your Data",
    content: `We use your data to: process program and fellowship applications; respond to contact inquiries; send newsletter updates to subscribers who have explicitly opted in; manage event registration and capacity; and administer staff access to our CMS control panel. We do not sell or share personal data with third parties for marketing purposes.`,
  },
  {
    id: "03",
    title: "Data Retention Schedules",
    content: `Per our Data Retention Policy: Contact messages are retained for 30 days after resolution. Event registrations are retained for 12 months after the event concludes. Applicant data is deleted 6 months after the associated program closes. Newsletter subscriptions are retained until an active unsubscribe request is processed. Staff account data is retained for the duration of employment and deleted within 30 days of departure.`,
  },
  {
    id: "04",
    title: "Third-Party Processors",
    content: `We utilize the following processors: Cloudflare (DDoS protection, edge routing and CDN); AWS IaaS af-south-1 Cape Town (server infrastructure and transactional email via SES); Plausible Analytics (privacy-first, cookie-free page analytics with no personal data collection). All processors have executed Data Processing Agreements compliant with applicable data protection legislation.`,
  },
  {
    id: "05",
    title: "Data Security",
    content: `Personal data is encrypted in transit via TLS 1.2+ and at rest via AES-256. Passwords are hashed using Argon2id. Access to personal data is restricted to authorized staff with the minimum required permissions. Our infrastructure undergoes periodic security reviews aligned with our documented threat model.`,
  },
  {
    id: "06",
    title: "Your Rights & Data Requests",
    content: `You have the right to access, correct, or request deletion of your personal data held by us. To submit a data request, please contact us using the form on our Contact page or email us directly. We will process verified requests within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface text-content">
      <section className="border-b border-brand/20 bg-gradient-to-b from-card to-surface py-16">
        <div className="mx-auto max-w-4xl px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">Legal Disclosure</span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-content sm:text-5xl">Privacy Policy</h1>
          <p className="mt-3 font-mono text-sm text-muted">
            Effective date: 01 January 2026
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl space-y-6 px-6">
          {SECTIONS.map((s) => (
            <div key={s.id} className="aristocratic-card rounded-2xl border-l-4 border-brand p-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-brand">{s.id}</span>
                <h2 className="text-lg font-bold text-content">{s.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">{s.content}</p>
            </div>
          ))}

          <div className="aristocratic-card rounded-2xl p-8 text-center">
            <p className="mb-4 text-sm text-muted">
              For data access requests or privacy-related questions, please use our inquiry form.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-brand px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover"
            >
              Submit a Data Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
