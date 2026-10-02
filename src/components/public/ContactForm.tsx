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
        setError("Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return <p className="rounded bg-green-50 p-4 text-green-800">Thank you, your message has been sent.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="fullName">
          Full name
        </label>
        <input id="fullName" name="fullName" required minLength={2} maxLength={100} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="subject">
          Subject
        </label>
        <input id="subject" name="subject" required minLength={3} maxLength={150} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="message">
          Message
        </label>
        <textarea id="message" name="message" required minLength={10} maxLength={5000} rows={5} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consentGiven" required className="mt-0.5" />
        <span>
          I consent to my data being processed as described in the{" "}
          <a href="/privacy" className="text-brand underline">
            privacy policy
          </a>
          .
        </span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
