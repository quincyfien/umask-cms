"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationReviewForm({
  applicationId,
  initialStatus,
  initialNotes,
}: {
  applicationId: string;
  initialStatus: string;
  initialNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const STATUS_OPTIONS = [
    { value: "SUBMITTED", label: "Submitted" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
  ];

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          reviewNotes: notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setMessage({ text: data?.detail ?? "Failed to update review status.", error: true });
        setSaving(false);
        return;
      }

      setMessage({ text: "Evaluation saved. Applicant notified if status changed." });
      setSaving(false);
      router.refresh();
    } catch {
      setMessage({ text: "Network error occurred.", error: true });
      setSaving(false);
    }
  }

  return (
    <div className="aristocratic-card rounded-2xl p-6 space-y-5 sticky top-6">
      <div className="border-b border-white/10 pb-3">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">COMMITTEE ACTION</span>
        <h3 className="text-base font-bold text-white mt-0.5">Evaluation & Decision</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
            Application Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`py-2 px-3 text-xs font-mono rounded-xl border text-center transition-all ${
                  status === opt.value
                    ? opt.value === "ACCEPTED"
                      ? "bg-brand/20 border-brand text-brand font-bold"
                      : opt.value === "REJECTED"
                      ? "bg-red-500/20 border-red-500 text-red-400 font-bold"
                      : "bg-blue-500/20 border-blue-500 text-blue-400 font-bold"
                    : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
            Internal / Applicant Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Feedback to include in the applicant's decision dispatch or for review records..."
            className="w-full rounded-xl border border-white/10 bg-ink px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-mono ${
              message.error
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-brand/10 border border-brand/20 text-brand"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="w-full rounded-full bg-brand py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-50 transition-colors shadow-lg shadow-brand/20"
        >
          {saving ? "Saving…" : "Save Evaluation"}
        </button>
      </div>
    </div>
  );
}
