import { getOrganization } from "@/lib/organization";
import ContactForm from "@/components/public/ContactForm";

export default async function ContactPage() {
  const org = await getOrganization();

  return (
    <div className="bg-ink text-paper min-h-screen">
      {/* Header */}
      <section className="relative py-16 border-b border-brand/20 bg-gradient-to-b from-ink-light to-ink">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold">GET IN TOUCH</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">Contact BTRC</h1>
          <p className="mt-3 text-gray-300 text-base max-w-xl">
            Reach out with research collaboration inquiries, service requests, or media relations.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
          {/* Left: Org Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="aristocratic-card p-6 rounded-2xl border-l-4 border-brand">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand mb-4">HEADQUARTERS</h3>
              <div className="space-y-4 text-sm text-gray-300">
                {org.address && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Address</span>
                    <span className="font-semibold text-white">{org.address}</span>
                  </div>
                )}
                {org.email && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Email</span>
                    <a href={`mailto:${org.email}`} className="text-brand font-mono hover:underline">{org.email}</a>
                  </div>
                )}
                {org.phone && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Phone</span>
                    <span className="font-semibold text-white">{org.phone}</span>
                  </div>
                )}
                {org.whatsapp && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">WhatsApp</span>
                    <a href={`https://wa.me/${org.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-brand font-mono hover:underline">
                      {org.whatsapp}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {org.socials.length > 0 && (
              <div className="aristocratic-card p-6 rounded-2xl">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand mb-4">FOLLOW US</h3>
                <div className="flex flex-wrap gap-3">
                  {org.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-full border border-brand/30 text-xs font-mono text-brand hover:bg-brand/10 transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="aristocratic-card p-6 rounded-2xl">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand mb-3">RESPONSE TIME</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Inquiries are reviewed Monday–Friday during office hours (08:00–17:00 WAT). Typical response time is within 2–3 business days.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-8">
            <div className="aristocratic-card p-8 sm:p-10 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Send an Inquiry</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
