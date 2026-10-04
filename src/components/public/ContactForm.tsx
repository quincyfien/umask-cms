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
      <div className="aristocratic-card space-y-3 rounded-2xl p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-xl text-brand">
          ✓
        </div>
        <h3 className="text-lg font-bold text-ink">Message Received</h3>
        <p className="mx-auto max-w-md text-xs leading-relaxed text-gray-600">
          Thank you for reaching out. Your inquiry has been routed to the relevant department and an officer will respond promptly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="aristocratic-card space-y-5 rounded-2xl p-8">
      <div className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-brand" htmlFor="fullName">
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your full name"
            className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-brand" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.org"
            className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-brand" htmlFor="subject">
          Subject *
        </label>
        <input
          id="subject"
          name="subject"
          required
          minLength={3}
          maxLength={150}
          placeholder="Research Collaboration or General Inquiry"
          className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase text-brand" htmlFor="message">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="Describe your inquiry, laboratory needs, or research proposal..."
          className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:border-brand focus:outline-none"
        />
      </div>

      <label className="flex items-start gap-2.5 text-xs text-gray-600">
        <input
          type="checkbox"
          name="consentGiven"
          required
          className="mt-0.5 rounded border-brand/40 text-brand accent-brand"
        />
        <span>
          I consent to my data being processed in accordance with the{" "}
          <a href="/privacy" className="text-brand underline hover:text-brand-hover">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-brand px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-50 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}
