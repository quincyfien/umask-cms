"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactReplyForm({
  messageId,
  senderEmail,
  subject,
  initialResolved,
}: {
  messageId: string;
  senderEmail: string;
  subject: string;
  initialResolved: boolean;
}) {
  const router = useRouter();
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [resolved, setResolved] = useState(initialResolved);
  const [result, setResult] = useState<{ text: string; error?: boolean } | null>(null);

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSending(true);
    setResult(null);

    try {
      const res = await fetch(`/api/admin/contacts/${messageId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replyText: replyText.trim(),
          subject: `Re: ${subject}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setResult({ text: data?.detail ?? "Failed to send response.", error: true });
        setSending(false);
        return;
      }

      setResult({ text: `Reply successfully dispatched to ${senderEmail}. Inquiry resolved.` });
      setResolved(true);
      setReplyText("");
      setSending(false);
      router.refresh();
    } catch {
      setResult({ text: "Network error occurred.", error: true });
      setSending(false);
    }
  }

  async function toggleStatus() {
    const nextStatus = resolved ? "READ" : "RESOLVED";
    try {
      const res = await fetch(`/api/admin/contacts/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setResolved(!resolved);
        router.refresh();
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="aristocratic-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">OFFICIAL CORRESPONDENCE</span>
          <h3 className="text-base font-bold text-white mt-0.5">Send Response</h3>
        </div>
        <button
          type="button"
          onClick={toggleStatus}
          className="text-xs font-mono text-gray-400 hover:text-white transition-colors"
        >
          Mark as {resolved ? "Open" : "Resolved"}
        </button>
      </div>

      <form onSubmit={handleSendReply} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
            Recipient: <span className="text-brand font-medium">{senderEmail}</span>
          </label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
            rows={6}
            placeholder="Compose official center correspondence..."
            className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-xs text-white focus:border-brand focus:outline-none leading-relaxed"
          />
        </div>

        {result && (
          <div
            className={`p-3 rounded-xl text-xs font-mono ${
              result.error
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-brand/10 border border-brand/20 text-brand"
            }`}
          >
            {result.text}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending || !replyText.trim()}
            className="rounded-full bg-brand px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover disabled:opacity-50 transition-colors shadow-lg shadow-brand/20"
          >
            {sending ? "Sending Dispatch…" : "Send Response & Resolve"}
          </button>
        </div>
      </form>
    </div>
  );
}
