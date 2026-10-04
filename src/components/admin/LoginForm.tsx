"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid credentials or unauthorized staff account.");
        setSubmitting(false);
      }
    } catch {
      setError("Network connection error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5">
      <div>
        <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5">
          Staff Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="staff@btrc-center.org"
          className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-xs font-mono font-semibold uppercase text-brand">
            Password
          </label>
          <Link href="/admin/reset-password" className="text-xs font-mono text-gray-400 hover:text-brand transition-colors">
            Forgot Password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••••••"
          className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-brand py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25 disabled:opacity-50"
      >
        {submitting ? "Authenticating..." : "Sign In to Admin Portal"}
      </button>
    </form>
  );
}
