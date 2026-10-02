"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = ["SERVICE", "PROGRAM", "PROJECT", "EVENT", "NEWS", "RESOURCE", "PAGE"];

type Props = {
  contentId?: string;
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

export default function ContentForm({ contentId, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      type: form.get("type"),
      summary: form.get("summary") || null,
      body: form.get("body") || null,
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" required defaultValue={initial?.title} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="type">
            Type
          </label>
          <select id="type" name="type" defaultValue={initial?.type ?? "NEWS"} className="mt-1 w-full rounded border border-gray-300 px-3 py-2">
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="summary">
          Summary
        </label>
        <textarea id="summary" name="summary" rows={2} defaultValue={initial?.summary ?? ""} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="body">
          Body
        </label>
        <textarea id="body" name="body" rows={12} defaultValue={initial?.body ?? ""} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="metaTitle">
            Meta title
          </label>
          <input id="metaTitle" name="metaTitle" defaultValue={initial?.metaTitle ?? ""} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="metaDescription">
            Meta description
          </label>
          <input id="metaDescription" name="metaDescription" defaultValue={initial?.metaDescription ?? ""} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving} className="rounded bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50">
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
