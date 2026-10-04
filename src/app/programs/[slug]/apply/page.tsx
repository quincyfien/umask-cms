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
    <div className="min-h-screen bg-paper py-16 text-ink">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <Link
            href={`/programs/${resolvedParams.slug}`}
            className="mb-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand hover:underline"
          >
            <span>← Back to Program Details</span>
          </Link>
          <span className="block font-mono text-xs font-semibold uppercase tracking-super-wide text-brand">
            Fellowship & Residency Application
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Program Application Form
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            Program Identifier: <span className="font-mono text-brand">{resolvedParams.slug}</span>
          </p>
        </div>

        {success ? (
          <div className="aristocratic-card space-y-4 rounded-2xl border border-brand/40 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand bg-brand/20 font-mono text-2xl font-bold text-brand">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-ink">Application Received</h2>
            <p className="mx-auto max-w-md text-sm text-gray-600">
              Your application has been submitted to the Academic Review Committee. You will receive an automated confirmation email shortly.
            </p>
            <div className="pt-4">
              <button
                onClick={() => router.push("/programs")}
                className="rounded-full bg-brand px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover"
              >
                Return to Programs
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="aristocratic-card space-y-6 rounded-2xl p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-2 block font-mono text-xs font-semibold uppercase text-brand">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="e.g. Dr. Jean Paul"
                  className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block font-mono text-xs font-semibold uppercase text-brand">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="applicant@domain.org"
                  className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block font-mono text-xs font-semibold uppercase text-brand">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+237 6xx xxx xxx"
                  className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="institution" className="mb-2 block font-mono text-xs font-semibold uppercase text-brand">
                  Institution / Organization *
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  required
                  placeholder="University / Company Name"
                  className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="motivation" className="mb-2 block font-mono text-xs font-semibold uppercase text-brand">
                Statement of Motivation & Background *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows={5}
                required
                placeholder="Describe your technical background, research goals, and motivation for joining this program..."
                className="w-full rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none"
              />
            </div>

            {/* Document Upload Box Preview */}
            <div className="rounded-xl border border-dashed border-brand/40 bg-gray-50 p-6 text-center">
              <span className="mb-1 block font-mono text-sm text-brand">📄 Supporting Document / CV Upload</span>
              <p className="text-xs text-gray-500">
                Drag and drop your CV or research proposal PDF (Max 10MB)
              </p>
              <input type="file" accept=".pdf,.docx" className="mt-3 text-xs text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-brand/20 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/30" />
            </div>

            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 font-mono text-xs text-red-500">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[10px] uppercase text-gray-500">* Required fields</span>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
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
