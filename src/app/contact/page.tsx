import { getOrganization } from "@/lib/organization";
import ContactForm from "@/components/public/ContactForm";

export default async function ContactPage() {
  const org = await getOrganization();

  return (
    <div className="min-h-screen bg-surface text-content">
      {/* Header */}
      <section className="border-b border-brand/20 bg-gradient-to-b from-card to-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">Get In Touch</span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-content sm:text-5xl">Contact Us</h1>
          <p className="mt-3 max-w-xl text-base text-muted">
            Reach out with research collaboration inquiries, service requests, or media relations.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12">
          {/* Left: Org Info */}
          <div className="space-y-6 lg:col-span-4">
            <div className="aristocratic-card rounded-2xl border-l-4 border-brand p-6">
              <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Headquarters</h3>
              <div className="space-y-4 text-sm text-muted">
                {org.address && (
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-muted">Address</span>
                    <span className="font-semibold text-content">{org.address}</span>
                  </div>
                )}
                {org.email && (
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-muted">Email</span>
                    <a href={`mailto:${org.email}`} className="font-mono text-brand hover:underline">{org.email}</a>
                  </div>
                )}
                {org.phone && (
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-muted">Phone</span>
                    <span className="font-semibold text-content">{org.phone}</span>
                  </div>
                )}
                {org.whatsapp && (
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-muted">WhatsApp</span>
                    <a href={`https://wa.me/${org.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="font-mono text-brand hover:underline">
                      {org.whatsapp}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {org.socials.length > 0 && (
              <div className="aristocratic-card rounded-2xl p-6">
                <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {org.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-brand/30 px-3 py-1.5 font-mono text-xs text-brand transition-colors hover:bg-brand/10"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="aristocratic-card rounded-2xl p-6">
              <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-brand">Response Time</h3>
              <p className="text-xs leading-relaxed text-muted">
                Inquiries are reviewed Monday–Friday during office hours (08:00–17:00 WAT). Typical response time is within 2–3 business days.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-8">
            <div className="aristocratic-card rounded-2xl p-8 sm:p-10">
              <h2 className="mb-6 text-xl font-bold text-content">Send an Inquiry</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
