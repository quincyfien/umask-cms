import type { ContentItem } from "@prisma/client";
import { RichText } from "./RichText";
import { formatDate, formatDateTime } from "@/lib/format";
import Link from "next/link";

export default function ContentDetail({
  item,
}: {
  item: ContentItem & { category?: { name: string } | null; author?: { name: string } | null };
}) {
  return (
    <div className="bg-ink text-paper min-h-screen">
      {/* Header Banner */}
      <section className="relative py-16 border-b border-brand/20 bg-gradient-to-b from-ink-light to-ink">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            {item.category && (
              <span className="rounded-full bg-brand/10 border border-brand/40 px-3 py-1 text-xs font-mono font-semibold text-brand uppercase tracking-wider">
                {item.category.name}
              </span>
            )}
            {item.publishedAt && (
              <span className="text-xs font-mono text-gray-400">Published {formatDate(item.publishedAt)}</span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {item.title}
          </h1>

          {item.summary && <p className="mt-4 text-lg text-gray-300 leading-relaxed font-normal">{item.summary}</p>}

          {item.author && <p className="mt-4 text-xs font-mono text-brand">Authored by {item.author.name}</p>}
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {item.type === "EVENT" && (
            <div className="aristocratic-card p-6 rounded-2xl mb-8 border-l-4 border-brand">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand mb-3">
                EVENT SPECIFICATIONS
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-300">
                {item.startAt && (
                  <div>
                    <span className="text-gray-500 uppercase font-mono block">Starts</span>
                    <span className="font-semibold text-white">{formatDateTime(item.startAt)}</span>
                  </div>
                )}
                {item.endAt && (
                  <div>
                    <span className="text-gray-500 uppercase font-mono block">Ends</span>
                    <span className="font-semibold text-white">{formatDateTime(item.endAt)}</span>
                  </div>
                )}
                {item.locationType === "PHYSICAL" && item.venueAddress && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 uppercase font-mono block">Venue Location</span>
                    <span className="font-semibold text-white">{item.venueAddress}</span>
                  </div>
                )}
                {item.locationType === "ONLINE" && item.onlineLink && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 uppercase font-mono block">Online Access URL</span>
                    <a href={item.onlineLink} target="_blank" rel="noreferrer" className="text-brand font-mono underline">
                      {item.onlineLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.type === "PROGRAM" && (
            <div className="aristocratic-card p-6 rounded-2xl mb-8 flex items-center justify-between border border-brand/30">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">STATUS</span>
                <span className="text-base font-bold text-brand uppercase">{item.programStatus || "ENROLLING"}</span>
              </div>
              <Link
                href={`/programs/${item.slug}/apply`}
                className="px-6 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25"
              >
                Apply For Program
              </Link>
            </div>
          )}

          {item.body ? (
            <div className="aristocratic-card p-8 sm:p-10 rounded-2xl">
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                <RichText html={item.body} />
              </div>
            </div>
          ) : (
            <div className="aristocratic-card p-8 rounded-2xl text-center text-xs text-gray-400">
              Detailed documentation will be published shortly.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
