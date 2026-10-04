"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/admin/TiptapEditor";

const TYPES = ["SERVICE", "PROGRAM", "PROJECT", "EVENT", "NEWS", "RESOURCE", "PAGE"];

type MediaAsset = {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
};

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
    featuredImageId?: string | null;
  };
};

export default function ContentForm({ contentId, defaultType, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [body, setBody] = useState(initial?.body ?? "");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [featuredImageId, setFeaturedImageId] = useState<string>(initial?.featuredImageId ?? "");

  useEffect(() => {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setAssets((d.assets ?? []).filter((a: MediaAsset) => a.mimeType.startsWith("image/"))))
      .catch(() => {});
  }, []);

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
      featuredImageId: featuredImageId || undefined,
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
          <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="title">
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
          <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="type">
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
        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="summary">
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

      {/* Featured Image */}
      <div>
        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="featuredImage">
          Featured Image
        </label>
        <select
          id="featuredImage"
          name="featuredImage"
          value={featuredImageId}
          onChange={(e) => setFeaturedImageId(e.target.value)}
          className="w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
        >
          <option value="">No featured image</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.fileName}
            </option>
          ))}
        </select>
        {assets.length === 0 && (
          <p className="mt-1.5 text-xs text-gray-400">
            No images available. Upload images in the Media section first.
          </p>
        )}
      </div>

      {/* Rich Text Body Editor */}
      <div>
        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand">
          Body Content
        </label>
        <TiptapEditor content={body} onChange={setBody} placeholder="Write full content here using the rich editor..." />
      </div>

      {/* SEO Meta */}
      <div className="grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="metaTitle">
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
          <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="metaDescription">
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
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-300 transition-colors hover:border-white hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand px-7 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {saving ? "Saving..." : contentId ? "Update Content" : "Publish Content"}
        </button>
      </div>
    </form>
  );
}
