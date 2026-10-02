import { getOrganization } from "@/lib/organization";
import ContactForm from "@/components/public/ContactForm";

export default async function ContactPage() {
  const org = await getOrganization();
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Contact</h1>
        <div className="mt-4 space-y-2 text-gray-700">
          {org.address && <p>{org.address}</p>}
          {org.phone && <p>Phone: {org.phone}</p>}
          {org.email && <p>Email: {org.email}</p>}
          {org.whatsapp && <p>WhatsApp: {org.whatsapp}</p>}
        </div>
        {org.socials.length > 0 && (
          <div className="mt-4 flex gap-3">
            {org.socials.map((s) => (
              <a key={s.label} href={s.url} className="text-brand underline">
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold">Send us a message</h2>
        <div className="mt-4">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
