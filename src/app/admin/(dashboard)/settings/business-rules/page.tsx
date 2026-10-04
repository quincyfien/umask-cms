"use client";

import { useState } from "react";

const RULES = [
  {
    section: "Application & Enrollment Policy",
    key: "applications_open",
    label: "Public Applications Enabled",
    type: "toggle",
    value: true,
    desc: "Allow the public to submit program & event applications via the website.",
  },
  {
    section: "Application & Enrollment Policy",
    key: "max_event_capacity",
    label: "Default Maximum Event Capacity",
    type: "number",
    value: 200,
    desc: "Default seating limit applied to all new events (overridable per event).",
  },
  {
    section: "Application & Enrollment Policy",
    key: "application_review_days",
    label: "Application Review Window (Days)",
    type: "number",
    value: 14,
    desc: "Days allowed for review before an application is auto-escalated.",
  },
  {
    section: "Content & Publishing Rules",
    key: "auto_archive_days",
    label: "Auto-Archive Unpublished Content After (Days)",
    type: "number",
    value: 90,
    desc: "Draft content older than this threshold is moved to ARCHIVED status automatically.",
  },
  {
    section: "Content & Publishing Rules",
    key: "items_per_page",
    label: "Public Listing Items Per Page",
    type: "number",
    value: 12,
    desc: "Number of items shown per page on Services, Programs, Projects, Events, and News listings.",
  },
  {
    section: "Content & Publishing Rules",
    key: "require_review_before_publish",
    label: "Require REVIEW Before Publishing",
    type: "toggle",
    value: true,
    desc: "Content must pass through REVIEW status before being published by an ADMIN.",
  },
  {
    section: "Newsletter & Communications",
    key: "newsletter_enabled",
    label: "Newsletter Signup Enabled",
    type: "toggle",
    value: true,
    desc: "Show the newsletter subscription form on the homepage and in the site footer.",
  },
  {
    section: "Newsletter & Communications",
    key: "contact_form_enabled",
    label: "Public Contact Form Enabled",
    type: "toggle",
    value: true,
    desc: "Enable the public to submit inquiries via the Contact page form.",
  },
];

export default function BusinessRulesPage() {
  const [rules, setRules] = useState(RULES);
  const [saved, setSaved] = useState(false);

  function updateRule(key: string, newValue: boolean | number) {
    setRules((prev) => prev.map((r) => (r.key === key ? { ...r, value: newValue } : r)));
    setSaved(false);
  }

  const sections = Array.from(new Set(rules.map((r) => r.section)));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-white/10 pb-5 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">ADMIN ONLY</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Business Rules</h1>
          <p className="text-xs text-gray-400 mt-1">Control platform-wide operational rules and policies.</p>
        </div>
        <button
          onClick={() => setSaved(true)}
          className="px-6 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
        >
          {saved ? "✓ Saved" : "Save Rules"}
        </button>
      </div>

      {sections.map((section) => (
        <div key={section} className="aristocratic-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">{section}</h2>
          </div>
          <div className="divide-y divide-white/5">
            {rules.filter((r) => r.section === section).map((rule) => (
              <div key={rule.key} className="px-6 py-5 flex items-start justify-between gap-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{rule.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{rule.desc}</p>
                </div>
                <div className="flex-shrink-0">
                  {rule.type === "toggle" ? (
                    <button
                      type="button"
                      onClick={() => updateRule(rule.key, !rule.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rule.value ? "bg-brand" : "bg-gray-600"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${rule.value ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  ) : (
                    <input
                      type="number"
                      value={rule.value as number}
                      onChange={(e) => updateRule(rule.key, parseInt(e.target.value, 10))}
                      className="w-24 rounded-xl border border-brand/30 bg-ink-light px-3 py-2 text-sm text-white font-mono text-center focus:border-brand focus:outline-none"
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
