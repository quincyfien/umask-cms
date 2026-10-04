"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: form.get("fullName"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message"),
      consentGiven: form.get("consentGiven") === "on",
      idempotencyKey: crypto.randomUUID(),
      website: form.get("website"),
    };
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setStatus("error");
        setError("Something went wrong. Please verify your entries and try again.");
        return;
      }
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setError("Network connection failure. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="aristocratic-card rounded-2xl p-8 text-center space-y-3 border-brand/50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-brand text-xl">
          ✓
        </div>
        <h3 className="text-lg font-bold text-white">Transmission Received</h3>
        <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to the Bamenda Tech Research Center. Your inquiry has been routed to the relevant department and an officer will respond promptly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="aristocratic-card rounded-2xl p-8 space-y-5">
      <div className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="fullName">
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            minLength={2}
            maxLength={100}
            placeholder="Dr. Eleanor Vance"
            className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="email">
            Official Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="e.vance@institution.org"
            className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="subject">
          Subject / Inquiry Domain *
        </label>
        <input
          id="subject"
          name="subject"
          required
          minLength={3}
          maxLength={150}
          placeholder="Research Collaboration or Instrumentation Request"
          className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="message">
          Detailed Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="Specify laboratory needs, research proposal overview, or general academic inquiries..."
          className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-brand focus:outline-none"
        />
      </div>

      <label className="flex items-start gap-2.5 text-xs text-gray-400">
        <input
          type="checkbox"
          name="consentGiven"
          required
          className="mt-0.5 rounded border-brand/40 bg-ink-light text-brand accent-brand focus:ring-brand"
        />
        <span>
          I consent to my data being processed in accordance with the BTRC Institutional{" "}
          <a href="/privacy" className="text-brand underline hover:text-brand-hover">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error && (
        <p className="text-xs text-red-400 font-mono bg-red-500/10 p-3 rounded-xl border border-red-500/30">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20 disabled:opacity-50"
      >
        {status === "submitting" ? "Transmitting…" : "Transmit Inquiry →"}
      </button>
    </form>
  );
}
