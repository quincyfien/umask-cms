"use client";

import { useState } from "react";

type Asset = {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
};

export default function MediaGallery({ initialAssets }: { initialAssets: Asset[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mime: string) => mime.startsWith("image/");

  function copyUrl(id: string) {
    const url = `${window.location.origin}/api/media/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (initialAssets.length === 0) {
    return (
      <div className="aristocratic-card p-10 rounded-2xl text-center text-gray-500 font-mono text-xs">
        No media assets catalogued yet. Upload files above to build the institutional media archive.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {initialAssets.map((a) => {
        const url = `/api/media/${a.id}`;
        return (
          <div key={a.id} className="aristocratic-card rounded-xl overflow-hidden group">
            <div className="aspect-video bg-ink-light flex items-center justify-center text-3xl border-b border-white/5 relative">
              {isImage(a.mimeType) ? (
                <img src={url} alt={a.fileName} className="w-full h-full object-cover" />
              ) : (
                <span>{a.mimeType.includes("pdf") ? "📄" : "📁"}</span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-white truncate" title={a.fileName}>
                {a.fileName}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-mono text-gray-500">{formatSize(a.size)}</span>
                <span className="text-[10px] font-mono text-gray-500">{a.mimeType.split("/")[1]?.toUpperCase()}</span>
              </div>
              <button
                type="button"
                onClick={() => copyUrl(a.id)}
                className="mt-2 w-full text-[10px] font-mono text-brand hover:text-white transition-colors border border-brand/30 hover:bg-brand/20 rounded-lg px-2 py-1.5"
              >
                {copiedId === a.id ? "✓ Copied to Clipboard" : "Copy Asset URL"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
