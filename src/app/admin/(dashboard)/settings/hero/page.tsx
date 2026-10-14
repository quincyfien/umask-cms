import { requirePagePermission } from "@/lib/auth";
import { getHeroConfig } from "@/lib/settings";
import HeroSettingsForm from "./HeroSettingsForm";

export default async function HeroSettingsPage() {
  await requirePagePermission("settings.manage");
  const heroConfig = await getHeroConfig();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">HOMEPAGE BRANDING</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Hero Configuration</h1>
        <p className="text-xs text-gray-400 mt-1">
          Customize the prominent heading, scientific tagline, and calls to action displayed on the landing page.
        </p>
      </div>

      <HeroSettingsForm initialConfig={heroConfig} />
    </div>
  );
}
