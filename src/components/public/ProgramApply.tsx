"use client";

import { useState } from "react";

type Props = {
  programId: string;
  programTitle: string;
  badgeLabel: string;
  applyOpen: boolean;
  closed: boolean;
  cta: string;
};

const APPLICANT_TYPES = ["STUDENT", "RESEARCHER", "PROFESSIONAL", "OTHER"];

export default function ProgramApply({ programId, programTitle, badgeLabel, applyOpen, closed, cta }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      programId,
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      institution: form.get("institution") || undefined,
      position: form.get("position") || undefined,
      applicantType: form.get("applicantType"),
      motivation: form.get("motivation"),
      consentGiven: form.get("consentGiven") === "on",
      idempotencyKey: crypto.randomUUID(),
      website: form.get("website"),
    };
    try {
      const res = await fetch("/api/public/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? "Submission failed.");
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      setDone(data.reference ?? "submitted");
      setSubmitting(false);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const canApply = applyOpen && !closed;
  const inputCls = "w-full rounded-xl border border-brand/30 bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none";

  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-brand/30 p-6">
      <div>
        <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">Status</span>
        <span className="text-base font-bold uppercase text-brand">{badgeLabel}</span>
      </div>
      <button
        type="button"
        disabled={!canApply}
        onClick={() => setOpen(true)}
        className="rounded-full bg-brand px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cta}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-brand/30 bg-card p-8">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-content">Apply — {programTitle}</h2>
                <p className="mt-1 text-xs text-muted">Complete the application form below.</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-content">✕</button>
            </div>

            {done ? (
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-2xl text-brand">✓</div>
                <p className="font-bold text-content">Application Received</p>
                <p className="mt-2 text-sm text-muted">
                  Keep this reference number: <span className="font-mono font-semibold text-brand">{done}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="hidden">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted">Full Name *</label>
                    <input name="fullName" required minLength={2} maxLength={100} className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted">Email *</label>
                    <input name="email" type="email" required className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted">Phone</label>
                    <input name="phone" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted">Institution</label>
                    <input name="institution" maxLength={150} className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted">Position / Field</label>
                    <input name="position" maxLength={150} className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted">Applicant Type *</label>
                    <select name="applicantType" required className={inputCls}>
                      {APPLICANT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Motivation (50–3000 characters) *</label>
                  <textarea name="motivation" required minLength={50} maxLength={3000} rows={4} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Supporting Documents (PDF, up to 10MB)</label>
                  <input type="file" accept=".pdf" className="text-xs text-muted" />
                </div>
                <label className="flex items-start gap-2 text-xs text-muted">
                  <input type="checkbox" name="consentGiven" required className="mt-0.5 accent-brand" />
                  <span>I consent to my data being processed per the <a href="/privacy" className="text-brand underline">privacy policy</a>.</span>
                </label>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-edge px-5 py-2 text-xs uppercase text-muted">Cancel</button>
                  <button type="submit" disabled={submitting} className="rounded-full bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-50">
                    {submitting ? "Submitting…" : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
