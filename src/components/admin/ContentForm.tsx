"use client";

import { useEffect, useRef, useState } from "react";
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
    details?: Record<string, unknown> | null;
  };
};

function toIso(v: string | undefined): string | undefined {
  return v ? new Date(v).toISOString() : undefined;
}

function toLocalInput(v: unknown): string {
  return v ? new Date(v as string).toISOString().slice(0, 16) : "";
}

function splitLines(v: unknown): string {
  return Array.isArray(v) ? (v as string[]).join("\n") : "";
}

function parseLines(s: string): string[] {
  return s.split("\n").map((x) => x.trim()).filter(Boolean);
}

function parsePartners(s: string): { name: string; url?: string }[] {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, url] = line.split("|").map((p) => p.trim());
      return url ? { name, url } : { name };
    });
}

export default function ContentForm({ contentId, defaultType, initial }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [body, setBody] = useState(initial?.body ?? "");
  const [type, setType] = useState(initial?.type ?? defaultType ?? "NEWS");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [featuredImageId, setFeaturedImageId] = useState<string>(initial?.featuredImageId ?? "");
  const [d, setD] = useState<Record<string, unknown>>(initial?.details ?? {});

  useEffect(() => {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((data) => setAssets((data.assets ?? []).filter((a: MediaAsset) => a.mimeType.startsWith("image/"))))
      .catch(() => {});
  }, []);

  function set(key: string, value: unknown) {
    setD((prev) => ({ ...prev, [key]: value }));
  }

  async function save(mode: "draft" | "publish") {
    if (!formRef.current) return;
    setSaving(mode);
    setError(null);
    const form = new FormData(formRef.current);
    const payload = {
      title: form.get("title"),
      type: form.get("type"),
      summary: form.get("summary") || null,
      body: body || null,
      categoryId: form.get("categoryId") || undefined,
      metaTitle: form.get("metaTitle") || undefined,
      metaDescription: form.get("metaDescription") || undefined,
      featuredImageId: featuredImageId || undefined,
      status: mode === "publish" ? "PUBLISHED" : "DRAFT",
      details: d,
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
        setSaving(null);
        return;
      }
      router.push("/admin/content");
      router.refresh();
    } catch {
      setError("Network error.");
      setSaving(null);
    }
  }

  const inputCls = "w-full rounded-xl border border-brand/30 bg-ink-light px-4 py-3 text-sm text-white focus:border-brand focus:outline-none";

  return (
    <form ref={formRef} className="space-y-6">
      {/* Title & Type */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="title">
            Title *
          </label>
          <input id="title" name="title" required defaultValue={initial?.title} className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="type">
            Content Type *
          </label>
          <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="summary">
          Summary / Excerpt *
        </label>
        <textarea id="summary" name="summary" rows={2} required defaultValue={initial?.summary ?? ""} className={inputCls} />
      </div>

      {/* Featured Image */}
      <div>
        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="featuredImage">
          Featured Image {type === "SERVICE" ? "*" : "(optional)"}
        </label>
        <select id="featuredImage" name="featuredImage" value={featuredImageId} onChange={(e) => setFeaturedImageId(e.target.value)} className={inputCls}>
          <option value="">No featured image</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>{a.fileName}</option>
          ))}
        </select>
        {assets.length === 0 && <p className="mt-1.5 text-xs text-gray-400">No images available. Upload images in Media first.</p>}
      </div>

      {/* PROGRAM fields */}
      {type === "PROGRAM" && (
        <div className="space-y-4 rounded-xl border border-brand/20 p-5">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">Program Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Application Opens</label>
              <input type="datetime-local" defaultValue={toLocalInput(d.applicationStartAt)} onChange={(e) => set("applicationStartAt", toIso(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Application Closes</label>
              <input type="datetime-local" defaultValue={toLocalInput(d.applicationCloseAt)} onChange={(e) => set("applicationCloseAt", toIso(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Program Starts</label>
              <input type="datetime-local" defaultValue={toLocalInput(d.programStartAt)} onChange={(e) => set("programStartAt", toIso(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Program Ends</label>
              <input type="datetime-local" defaultValue={toLocalInput(d.programEndAt)} onChange={(e) => set("programEndAt", toIso(e.target.value))} className={inputCls} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Delivery Mode</label>
              <select value={(d.deliveryMode as string) ?? ""} onChange={(e) => set("deliveryMode", e.target.value || undefined)} className={inputCls}>
                <option value="">Select…</option>
                <option value="PHYSICAL">On-Site</option>
                <option value="ONLINE">Online</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Category Tag</label>
              <input defaultValue={initial?.categoryId ?? ""} name="categoryTag" className={inputCls} placeholder="e.g. Cybersecurity, Applied Physics" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-400">Eligibility Criteria (one per line)</label>
            <textarea rows={3} defaultValue={splitLines(d.eligibility)} onChange={(e) => set("eligibility", parseLines(e.target.value))} className={inputCls} />
          </div>
        </div>
      )}

      {/* PROJECT fields */}
      {type === "PROJECT" && (
        <div className="space-y-4 rounded-xl border border-brand/20 p-5">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">Project Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Status</label>
              <select value={(d.projectStatus as string) ?? "PLANNED"} onChange={(e) => set("projectStatus", e.target.value)} className={inputCls}>
                <option value="PLANNED">Planned</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">DOI / Reference Code</label>
              <input defaultValue={(d.doi as string) ?? ""} onChange={(e) => set("doi", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-400">Objectives & Research Scope (one per line)</label>
            <textarea rows={3} defaultValue={splitLines(d.objectives)} onChange={(e) => set("objectives", parseLines(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-400">Methodology & Architecture</label>
            <textarea rows={3} defaultValue={(d.methodology as string) ?? ""} onChange={(e) => set("methodology", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-400">Key Findings / Outcomes</label>
            <textarea rows={3} defaultValue={(d.findings as string) ?? ""} onChange={(e) => set("findings", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-400">Partners & Collaborators (Name | URL, one per line)</label>
            <textarea rows={2} defaultValue={(d.partners as { name: string; url?: string }[])?.map((p) => (p.url ? `${p.name} | ${p.url}` : p.name)).join("\n") ?? ""} onChange={(e) => set("partners", parsePartners(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-400">Research Leads & Contributors (one per line)</label>
            <textarea rows={2} defaultValue={splitLines(d.leads)} onChange={(e) => set("leads", parseLines(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-400">Downloadable Deliverables (URLs, one per line)</label>
            <textarea rows={2} defaultValue={splitLines(d.deliverables)} onChange={(e) => set("deliverables", parseLines(e.target.value))} className={inputCls} />
          </div>
        </div>
      )}

      {/* SERVICE fields */}
      {type === "SERVICE" && (
        <div className="space-y-4 rounded-xl border border-brand/20 p-5">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">Service Capabilities</h3>
          <label className="mb-1 block text-[11px] text-gray-400">Key Capabilities (one per line)</label>
          <textarea rows={3} defaultValue={splitLines(d.capabilities)} onChange={(e) => set("capabilities", parseLines(e.target.value))} className={inputCls} />
        </div>
      )}

      {/* EVENT fields */}
      {type === "EVENT" && (
        <div className="space-y-4 rounded-xl border border-brand/20 p-5">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">Event Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Event Type</label>
              <select value={(d.eventKind as string) ?? "EVENT"} onChange={(e) => set("eventKind", e.target.value)} className={inputCls}>
                <option value="EVENT">Event</option>
                <option value="WORKSHOP">Workshop</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Organizer / Host</label>
              <input defaultValue={(d.organizer as string) ?? ""} onChange={(e) => set("organizer", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Start</label>
              <input type="datetime-local" defaultValue={toLocalInput(d.startAt)} onChange={(e) => set("startAt", toIso(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">End</label>
              <input type="datetime-local" defaultValue={toLocalInput(d.endAt)} onChange={(e) => set("endAt", toIso(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Location Type</label>
              <select value={(d.locationType as string) ?? ""} onChange={(e) => set("locationType", e.target.value || undefined)} className={inputCls}>
                <option value="">Select…</option>
                <option value="PHYSICAL">Physical</option>
                <option value="ONLINE">Online</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Venue / Link</label>
              <input defaultValue={(d.venueAddress as string) ?? ""} onChange={(e) => set("venueAddress", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Capacity (optional)</label>
              <input type="number" defaultValue={d.capacity ? Number(d.capacity) : ""} onChange={(e) => set("capacity", e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input type="checkbox" checked={Boolean(d.registrationEnabled)} onChange={(e) => set("registrationEnabled", e.target.checked)} className="accent-brand" />
            Enable RSVP / Registration
          </label>
        </div>
      )}

      {/* NEWS fields */}
      {type === "NEWS" && (
        <div className="space-y-4 rounded-xl border border-brand/20 p-5">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">News Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Author / Byline</label>
              <input defaultValue={(d.byline as string) ?? ""} onChange={(e) => set("byline", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-gray-400">Publication Date</label>
              <input type="datetime-local" defaultValue={toLocalInput(d.publicationDate)} onChange={(e) => set("publicationDate", toIso(e.target.value))} className={inputCls} />
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div>
        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand">Body Content</label>
        <TiptapEditor content={body} onChange={setBody} placeholder="Write full content here using the rich editor..." />
      </div>

      {/* SEO Meta */}
      <div className="grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="metaTitle">SEO Meta Title</label>
          <input id="metaTitle" name="metaTitle" defaultValue={initial?.metaTitle ?? ""} className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-mono font-semibold uppercase text-brand" htmlFor="metaDescription">SEO Meta Description</label>
          <input id="metaDescription" name="metaDescription" defaultValue={initial?.metaDescription ?? ""} className={inputCls} />
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{error}</div>}

      <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-4">
        <button type="button" onClick={() => router.back()} className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-white">
          Cancel
        </button>
        <button
          type="button"
          disabled={saving !== null}
          onClick={() => save("draft")}
          className="rounded-full border border-brand/40 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand hover:bg-brand/10 disabled:opacity-50"
        >
          {saving === "draft" ? "Saving…" : "Save Draft"}
        </button>
        <button
          type="button"
          disabled={saving !== null}
          onClick={() => save("publish")}
          className="rounded-full bg-brand px-7 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {saving === "publish" ? "Publishing…" : "Publish"}
        </button>
      </div>
    </form>
  );
}
