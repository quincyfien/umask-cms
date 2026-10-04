"use client";

import { useEffect, useState } from "react";

type Rule = {
  section: string;
  key: string;
  label: string;
  type: "toggle" | "number";
  value: boolean | number;
  desc: string;
};

const RULES: Omit<Rule, "value">[] = [
  {
    section: "Bot Protection & Analytics",
    key: "turnstile_enabled",
    label: "Cloudflare Turnstile (Bot Check)",
    type: "toggle",
    desc: "Require a bot-verification challenge on public forms.",
  },
  {
    section: "Bot Protection & Analytics",
    key: "analytics_enabled",
    label: "Analytics (Plausible)",
    type: "toggle",
    desc: "Load the privacy-friendly analytics script on public pages.",
  },
  {
    section: "Enrollment & Applications",
    key: "applications_open",
    label: "Public Applications Enabled",
    type: "toggle",
    desc: "Allow the public to submit program applications.",
  },
  {
    section: "Content & Publishing",
    key: "require_review_before_publish",
    label: "Require REVIEW Before Publishing",
    type: "toggle",
    desc: "Block publishing directly from DRAFT (must go through REVIEW).",
  },
  {
    section: "Content & Publishing",
    key: "pagination.items_per_page",
    label: "Items Per Page (Public Feeds)",
    type: "number",
    desc: "Number of items per page on Services, Programs, Projects, Events and News.",
  },
  {
    section: "Communications",
    key: "newsletter_enabled",
    label: "Newsletter Signup Enabled",
    type: "toggle",
    desc: "Show the newsletter subscription form in the footer.",
  },
  {
    section: "Communications",
    key: "contact_form_enabled",
    label: "Public Contact Form Enabled",
    type: "toggle",
    desc: "Show the inquiry form on the Contact page.",
  },
];

export default function BusinessRulesForm() {
  const [values, setValues] = useState<Record<string, boolean | number>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings ?? {};
        const initial: Record<string, boolean | number> = {};
        for (const rule of RULES) {
          const fallback = rule.type === "toggle" ? false : 12;
          initial[rule.key] = rule.key in s ? (s[rule.key] as boolean | number) : fallback;
        }
        setValues(initial);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function setValue(key: string, value: boolean | number) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  const sections = Array.from(new Set(RULES.map((r) => r.section)));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-end justify-between border-b border-white/10 pb-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-brand">Admin Only</span>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-white">Business Rules</h1>
          <p className="mt-1 text-xs text-gray-400">Control platform-wide operational rules and policies.</p>
        </div>
        <button
          onClick={save}
          disabled={saving || !loaded}
          className="rounded-full bg-brand px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save Rules"}
        </button>
      </div>

      {sections.map((section) => (
        <div key={section} className="aristocratic-card overflow-hidden rounded-2xl">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">{section}</h2>
          </div>
          <div className="divide-y divide-white/5">
            {RULES.filter((r) => r.section === section).map((rule) => (
              <div key={rule.key} className="flex items-start justify-between gap-6 px-6 py-5">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{rule.label}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{rule.desc}</p>
                </div>
                <div className="flex-shrink-0">
                  {rule.type === "toggle" ? (
                    <button
                      type="button"
                      onClick={() => setValue(rule.key, !values[rule.key])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        values[rule.key] ? "bg-brand" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          values[rule.key] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  ) : (
                    <input
                      type="number"
                      value={Number(values[rule.key] ?? 12)}
                      onChange={(e) => setValue(rule.key, parseInt(e.target.value, 10) || 12)}
                      className="w-24 rounded-xl border border-brand/30 bg-ink-light px-3 py-2 text-center font-mono text-sm text-white focus:border-brand focus:outline-none"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
