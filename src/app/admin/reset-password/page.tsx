"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink text-paper px-4 py-12">
      <div className="w-full max-w-md aristocratic-card rounded-2xl p-8 sm:p-10 border border-brand/30 shadow-2xl">
        <div className="mb-6">
          <Link href="/admin/login" className="text-xs font-mono text-brand hover:underline uppercase tracking-wider inline-flex items-center gap-1">
            <span>← Back to Sign In</span>
          </Link>
          <span className="text-[10px] font-mono tracking-super-wide uppercase text-brand font-semibold block mt-4">
            SECURITY RECOVERY
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Reset Password</h1>
          <p className="text-xs text-gray-400 mt-2">
            Enter your registered staff email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-xl bg-brand/10 border border-brand/40 text-center space-y-3">
            <span className="text-brand font-mono text-xl block">✉</span>
            <h2 className="text-base font-bold text-white">Reset Link Dispatched</h2>
            <p className="text-xs text-gray-300">
              If your email is registered in the BTRC Staff Directory, password recovery instructions have been sent.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5">
                Staff Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="staff@btrc-center.org"
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-brand py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25"
            >
              Send Password Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
