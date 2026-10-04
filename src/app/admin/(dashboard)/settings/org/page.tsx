import { getOrganization, saveOrganization } from "@/lib/organization";
import { revalidatePath } from "next/cache";
import { requirePagePermission } from "@/lib/auth";

async function handleSave(formData: FormData) {
  "use server";
  await saveOrganization({
    name: (formData.get("name") as string) || "Bamenda Tech Research Center",
    description: (formData.get("description") as string) || "",
    address: (formData.get("address") as string) || "",
    phone: (formData.get("phone") as string) || "",
    email: (formData.get("email") as string) || "",
    whatsapp: (formData.get("whatsapp") as string) || "",
    socials: [
      { label: "GitHub", url: (formData.get("social_github") as string) || "" },
      { label: "X (Twitter)", url: (formData.get("social_x") as string) || "" },
      { label: "LinkedIn", url: (formData.get("social_linkedin") as string) || "" },
      { label: "YouTube", url: (formData.get("social_youtube") as string) || "" },
    ].filter((s) => s.url),
    mapConfig: null,
  });
  revalidatePath("/admin/settings/org");
}

export default async function OrgSettingsPage() {
  await requirePagePermission("settings.manage");
  const org = await getOrganization();
  const socialMap = Object.fromEntries(org.socials.map((s) => [s.label, s.url]));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">ADMIN ONLY</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Organization Info</h1>
        <p className="text-xs text-gray-400 mt-1">Update public-facing organization details and contact information.</p>
      </div>

      <form action={handleSave} className="space-y-6">
        {/* Identity */}
        <div className="aristocratic-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">Identity & Description</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="name">
                Organization Name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={org.name}
                required
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="description">
                Tagline / Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                defaultValue={org.description}
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="aristocratic-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">Contact Details</h2>
          </div>
          <div className="px-6 py-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="email">
                Primary Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={org.email}
                placeholder="inquiries@btrc-center.org"
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                defaultValue={org.phone}
                placeholder="+237 6xx xxx xxx"
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="whatsapp">
                WhatsApp Number
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                defaultValue={org.whatsapp}
                placeholder="+237 6xx xxx xxx"
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="address">
                Campus Address
              </label>
              <input
                id="address"
                name="address"
                defaultValue={org.address}
                placeholder="Bambili, NW Region, Cameroon"
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="aristocratic-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">Social Media Links</h2>
          </div>
          <div className="px-6 py-5 grid gap-4 sm:grid-cols-2">
            {[
              { key: "social_github", label: "GitHub", placeholder: "https://github.com/btrc" },
              { key: "social_x", label: "X (Twitter)", placeholder: "https://x.com/btrc" },
              { key: "social_linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/btrc" },
              { key: "social_youtube", label: "YouTube", placeholder: "https://youtube.com/@btrc" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor={key}>
                  {label}
                </label>
                <input
                  id={key}
                  name={key}
                  type="url"
                  defaultValue={socialMap[label] ?? ""}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-7 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
          >
            Save Organization Info
          </button>
        </div>
      </form>
    </div>
  );
}
