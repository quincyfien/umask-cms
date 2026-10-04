"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          consentGiven: form.get("consentGiven") === "on",
          idempotencyKey: crypto.randomUUID(),
          website: form.get("website"),
        }),
      });
      if (res.ok) {
        setStatus("success");
        e.currentTarget.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-brand">Check your inbox to confirm.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email address"
          className="w-full rounded-l-lg border border-white/20 bg-ink-2 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-r-lg bg-brand px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {status === "submitting" ? "…" : "Submit"}
        </button>
      </div>
      <label className="mt-3 flex items-start gap-2 text-xs text-gray-400">
        <input type="checkbox" name="consentGiven" required className="mt-0.5" />
        <span>
          I consent to receiving updates as described in the{" "}
          <a href="/privacy" className="text-brand underline">
            privacy policy
          </a>
          .
        </span>
      </label>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
