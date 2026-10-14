"use client";

import { useState } from "react";
import type { HeroConfig } from "@/lib/settings";

export default function HeroSettingsForm({
  initialConfig,
}: {
  initialConfig: HeroConfig;
}) {
  const [config, setConfig] = useState<HeroConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero: config }),
      });

      if (!res.ok) {
        setError("Failed to save hero banner configurations.");
        setSaving(false);
        return;
      }

      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error occurred.");
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-xs text-white focus:border-brand focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSave} className="aristocratic-card rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
            Tagline / Supertitle
          </label>
          <input
            value={config.tagline}
            onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
            placeholder="Research. Innovate. Build. Sustain."
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
            Main Headline <span className="text-brand">*</span>
          </label>
          <input
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            required
            placeholder="Turning Ideas Into Technology That Matters"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
            Institutional Subtitle
          </label>
          <textarea
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            rows={3}
            placeholder="A technology research institution dedicated to transforming scientific ideas into practical engineering solutions..."
            className={inputCls}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand mb-1">
              Primary CTA Button Label
            </label>
            <input
              value={config.ctaPrimaryLabel}
              onChange={(e) => setConfig({ ...config, ctaPrimaryLabel: e.target.value })}
              placeholder="Explore Research Projects"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-brand mb-1">
              Primary CTA Destination URL
            </label>
            <input
              value={config.ctaPrimaryHref}
              onChange={(e) => setConfig({ ...config, ctaPrimaryHref: e.target.value })}
              placeholder="/projects"
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              Secondary CTA Button Label
            </label>
            <input
              value={config.ctaSecondaryLabel}
              onChange={(e) => setConfig({ ...config, ctaSecondaryLabel: e.target.value })}
              placeholder="Request a Service"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              Secondary CTA Destination URL
            </label>
            <input
              value={config.ctaSecondaryHref}
              onChange={(e) => setConfig({ ...config, ctaSecondaryHref: e.target.value })}
              placeholder="/contact"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-xs font-mono bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {saved && (
        <div className="p-3 rounded-xl text-xs font-mono bg-brand/10 border border-brand/20 text-brand">
          ✓ Hero configuration saved successfully.
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-50 transition-colors shadow-lg shadow-brand/20"
        >
          {saving ? "Saving…" : "Save Hero Settings"}
        </button>
      </div>
    </form>
  );
}
