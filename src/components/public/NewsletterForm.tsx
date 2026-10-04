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
    return (
      <div className="rounded-xl border border-brand/40 bg-brand/10 p-3 text-xs font-mono text-brand">
        ✓ Check your inbox to confirm your subscription.
      </div>
    );
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
          className="w-full rounded-l-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-r-xl bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {status === "submitting" ? "…" : "Subscribe"}
        </button>
      </div>
      <label className="mt-2.5 flex items-start gap-2 text-[11px] text-gray-600">
        <input
          type="checkbox"
          name="consentGiven"
          required
          className="mt-0.5 rounded border-brand/40 text-brand accent-brand"
        />
        <span>
          I consent to receiving updates under the{" "}
          <a href="/privacy" className="text-brand underline hover:text-brand-hover">
            privacy policy
          </a>
          .
        </span>
      </label>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-500">Subscription request could not be processed. Please retry.</p>
      )}
    </form>
  );
}
