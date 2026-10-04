"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/admin/TiptapEditor";

const TYPES = ["SERVICE", "PROGRAM", "PROJECT", "EVENT", "NEWS", "RESOURCE", "PAGE"];

type Props = {
  contentId?: string;
  defaultType?: string;
  initial?: {
    title: string;
    type: string;
    summary?: string | null;
    body?: string | null;
    categoryId?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
};

export default function ContentForm({ contentId, defaultType, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [body, setBody] = useState(initial?.body ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      type: form.get("type"),
      summary: form.get("summary") || null,
      body: body || null,
      categoryId: form.get("categoryId") || undefined,
      metaTitle: form.get("metaTitle") || undefined,
      metaDescription: form.get("metaDescription") || undefined,
    };
    try {
      const res = await fetch(contentId ? `/api/admin/content/${contentId}` : "/api/admin/content", {
        method: contentId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? "Failed to save.");
        setSaving(false);
        return;
      }
      router.push("/admin/content");
      router.refresh();
    } catch {
      setError("Network error.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title & Type */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={initial?.title}
            placeholder="Content title..."
            className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="type">
            Content Type *
          </label>
          <select
            id="type"
            name="type"
            defaultValue={initial?.type ?? defaultType ?? "NEWS"}
            className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="summary">
          Summary / Excerpt
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={2}
          defaultValue={initial?.summary ?? ""}
          placeholder="Short summary displayed on listing pages..."
          className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
        />
      </div>

      {/* Rich Text Body Editor */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5">
          Body Content
        </label>
        <TiptapEditor content={body} onChange={setBody} placeholder="Write full content here using the rich editor..." />
      </div>

      {/* SEO Meta */}
      <div className="grid gap-5 sm:grid-cols-2 border-t border-white/10 pt-5">
        <div>
          <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="metaTitle">
            SEO Meta Title
          </label>
          <input
            id="metaTitle"
            name="metaTitle"
            defaultValue={initial?.metaTitle ?? ""}
            placeholder="Browser tab title override..."
            className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1.5" htmlFor="metaDescription">
            SEO Meta Description
          </label>
          <input
            id="metaDescription"
            name="metaDescription"
            defaultValue={initial?.metaDescription ?? ""}
            placeholder="Search engine description..."
            className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:border-white hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20 disabled:opacity-50"
        >
          {saving ? "Saving..." : contentId ? "Update Content" : "Publish Content"}
        </button>
      </div>
    </form>
  );
}
