"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { contents: number };
};

type Props = {
  type: "PROJECT" | "NEWS" | "SERVICE" | "PROGRAM" | "EVENT";
  title: string;
  subtitle: string;
  backHref: string;
  initialCategories: CategoryItem[];
};

export default function CategoryManager({
  type,
  title,
  subtitle,
  backHref,
  initialCategories,
}: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Failed to create category");
        setSaving(false);
        return;
      }

      const { category } = await res.json();
      setCategories((prev) => [...prev, { ...category, _count: { contents: 0 } }]);
      setName("");
      setSlug("");
      setDescription("");
      router.refresh();
    } catch {
      setError("Network error while creating category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete category.");
      }
    } catch {
      alert("Network error.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">TAXONOMY ARCHITECTURE</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">{title}</h1>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <a
          href={backHref}
          className="px-4 py-2 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:border-white hover:text-white transition-colors"
        >
          ← Return to Listing
        </a>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Create Category Form */}
        <div className="aristocratic-card rounded-2xl p-6 h-fit">
          <h2 className="text-base font-bold text-white mb-4">Create New Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Clean Energy Systems"
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-3.5 py-2.5 text-xs text-white focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1">
                URL Slug (optional)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="clean-energy-systems"
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-3.5 py-2.5 text-xs text-white focus:border-brand focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-brand mb-1">
                Scope / Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what falls under this scientific domain..."
                className="w-full rounded-xl border border-brand/30 bg-ink-light px-3.5 py-2.5 text-xs text-white focus:border-brand focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-mono bg-red-500/10 p-2.5 rounded-lg border border-red-500/30">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20 disabled:opacity-50"
            >
              {saving ? "Registering..." : "+ Register Category"}
            </button>
          </form>
        </div>

        {/* Existing Categories Table */}
        <div className="aristocratic-card rounded-2xl overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Registered Categories</h2>
            <span className="text-xs font-mono text-brand">{categories.length} total</span>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-5 py-3 font-mono text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-500 font-mono">
                    No categories registered for this section yet.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-brand/5 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">
                      <div>{c.name}</div>
                      {c.description && (
                        <div className="text-[11px] text-gray-400 font-normal mt-0.5">{c.description}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-gray-400">{c.slug}</td>
                    <td className="px-5 py-3 font-mono text-brand">{c._count?.contents ?? 0} items</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-400 hover:text-red-300 font-mono text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
