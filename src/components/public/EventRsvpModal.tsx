"use client";

import { useState } from "react";

type Props = {
  eventId: string;
  eventTitle: string;
};

export default function EventRsvpModal({ eventId, eventTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const payload = {
      eventId,
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      reason: form.get("reason"),
      consentGiven: form.get("consentGiven") === "on",
      idempotencyKey: crypto.randomUUID(),
      website: form.get("website"), // honeypot
    };

    try {
      const res = await fetch("/api/public/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? "Registration failed. Please check your details and try again.");
        setSubmitting(false);
        return;
      }

      setDone(true);
      setSubmitting(false);
    } catch {
      setError("Network error. Please try again later.");
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm text-content focus:border-brand focus:outline-none transition-colors";

  return (
    <>
      {/* Floating RSVP Button */}
      <button
        type="button"
        onClick={() => {
          setDone(false);
          setError(null);
          setOpen(true);
        }}
        className="fixed bottom-8 right-8 z-50 rounded-full bg-brand px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-xl shadow-brand/40 transition-all hover:bg-brand-hover hover:scale-105 active:scale-95"
      >
        RSVP Now
      </button>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-edge bg-card p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand">Event Registration</span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-content">{eventTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-content transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {done ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/20 text-3xl text-brand">
                  ✓
                </div>
                <h3 className="font-serif text-xl font-bold text-content">RSVP Confirmed</h3>
                <p className="mt-2 text-sm text-muted">
                  Your seat has been reserved. A confirmation dispatch has been sent to your email address.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-full bg-brand px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {/* Honeypot field */}
                <div className="hidden">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                    Full Name <span className="text-brand">*</span>
                  </label>
                  <input
                    name="fullName"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Dr. Jane Doe"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                    Email Address <span className="text-brand">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="jane.doe@institution.org"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+234 ..."
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                    Reason for Attending <span className="text-brand">*</span>
                  </label>
                  <textarea
                    name="reason"
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={3}
                    placeholder="Briefly describe your research focus, institutional interest, or background related to this symposium..."
                    className={inputCls}
                  />
                </div>

                <label className="flex items-start gap-2.5 pt-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    name="consentGiven"
                    required
                    className="mt-0.5 accent-brand"
                  />
                  <span>
                    I consent to the processing of my contact information in accordance with UNMASK&apos;s{" "}
                    <a href="/privacy" target="_blank" className="text-brand underline hover:opacity-80">
                      Privacy Policy
                    </a>.
                  </span>
                </label>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-edge px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted hover:border-muted hover:text-content transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-brand px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-50 transition-colors shadow-lg shadow-brand/20"
                  >
                    {submitting ? "Confirming…" : "Confirm RSVP"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
