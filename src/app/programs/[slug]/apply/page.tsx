"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProgramApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      programSlug: resolvedParams.slug,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      institution: formData.get("institution"),
      motivation: formData.get("motivation"),
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Submission failed. Please verify your details.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setSubmitting(false);
    } catch {
      setError("Network error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-ink text-paper min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link
            href={`/programs/${resolvedParams.slug}`}
            className="text-xs font-mono text-brand hover:underline uppercase tracking-wider inline-flex items-center gap-2 mb-3"
          >
            <span>← Back to Program Details</span>
          </Link>
          <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold block">
            FELLOWSHIP & RESIDENCY APPLICATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Program Application Form
          </h1>
          <p className="mt-2 text-xs text-gray-400">
            Program Identifier: <span className="font-mono text-brand">{resolvedParams.slug}</span>
          </p>
        </div>

        {success ? (
          <div className="aristocratic-card p-10 rounded-2xl text-center space-y-4 border border-brand/40">
            <div className="h-14 w-14 rounded-full bg-brand/20 border border-brand text-brand font-mono font-bold text-2xl flex items-center justify-center mx-auto">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white">Application Received</h2>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Your application has been submitted to the BTRC Academic Review Committee. You will receive an automated confirmation email shortly.
            </p>
            <div className="pt-4">
              <button
                onClick={() => router.push("/programs")}
                className="px-8 py-3 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors"
              >
                Return to Programs
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="aristocratic-card p-8 sm:p-10 rounded-2xl space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-xs font-mono font-semibold uppercase text-brand mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="e.g. Dr. Jean Paul"
                  className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase text-brand mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="applicant@domain.org"
                  className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-xs font-mono font-semibold uppercase text-brand mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+237 6xx xxx xxx"
                  className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="institution" className="block text-xs font-mono font-semibold uppercase text-brand mb-2">
                  Institution / Organization *
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  required
                  placeholder="University / Company Name"
                  className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="motivation" className="block text-xs font-mono font-semibold uppercase text-brand mb-2">
                Statement of Motivation & Background *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows={5}
                required
                placeholder="Describe your technical background, research goals, and motivation for joining this BTRC program..."
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>

            {/* Document Upload Box Preview */}
            <div className="border border-dashed border-brand/40 rounded-xl p-6 text-center bg-ink-light/50">
              <span className="text-brand font-mono text-sm block mb-1">📄 Supporting Document / CV Upload</span>
              <p className="text-xs text-gray-400">
                Drag and drop your CV or research proposal PDF (Max 10MB)
              </p>
              <input type="file" accept=".pdf,.docx" className="mt-3 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand/20 file:text-brand hover:file:bg-brand/30" />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 uppercase">* Required fields</span>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
