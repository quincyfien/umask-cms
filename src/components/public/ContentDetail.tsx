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
    <div className="min-h-screen bg-paper text-ink">
      {/* Header Banner */}
      <section className="border-b border-brand/20 bg-gradient-to-b from-white to-paper py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-4 flex items-center gap-3">
            {item.category && (
              <span className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-brand">
                {item.category.name}
              </span>
            )}
            {item.publishedAt && (
              <span className="font-mono text-xs text-gray-500">Published {formatDate(item.publishedAt)}</span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            {item.title}
          </h1>

          {item.summary && <p className="mt-4 text-lg leading-relaxed text-gray-600">{item.summary}</p>}

          {item.author && <p className="mt-4 font-mono text-xs text-brand">Authored by {item.author.name}</p>}
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          {item.featuredImageId && (
            <img
              src={`/api/media/${item.featuredImageId}`}
              alt={item.title}
              className="mb-8 max-h-[420px] w-full rounded-2xl object-cover"
            />
          )}

          {item.type === "EVENT" && (
            <div className="aristocratic-card mb-8 rounded-2xl border-l-4 border-brand p-6">
              <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-brand">
                Event Details
              </h3>
              <div className="grid gap-4 text-sm text-gray-600 sm:grid-cols-2">
                {item.startAt && (
                  <div>
                    <span className="block font-mono uppercase text-gray-400">Starts</span>
                    <span className="font-semibold text-ink">{formatDateTime(item.startAt)}</span>
                  </div>
                )}
                {item.endAt && (
                  <div>
                    <span className="block font-mono uppercase text-gray-400">Ends</span>
                    <span className="font-semibold text-ink">{formatDateTime(item.endAt)}</span>
                  </div>
                )}
                {item.locationType === "PHYSICAL" && item.venueAddress && (
                  <div className="sm:col-span-2">
                    <span className="block font-mono uppercase text-gray-400">Venue Location</span>
                    <span className="font-semibold text-ink">{item.venueAddress}</span>
                  </div>
                )}
                {item.locationType === "ONLINE" && item.onlineLink && (
                  <div className="sm:col-span-2">
                    <span className="block font-mono uppercase text-gray-400">Online Access URL</span>
                    <a href={item.onlineLink} target="_blank" rel="noreferrer" className="font-mono text-brand underline">
                      {item.onlineLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.type === "PROGRAM" && (
            <div className="aristocratic-card mb-8 flex items-center justify-between rounded-2xl border border-brand/30 p-6">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-gray-400">Status</span>
                <span className="text-base font-bold uppercase text-brand">{item.programStatus || "ENROLLING"}</span>
              </div>
              <Link
                href={`/programs/${item.slug}/apply`}
                className="rounded-full bg-brand px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover"
              >
                Apply For Program
              </Link>
            </div>
          )}

          {item.body ? (
            <div className="aristocratic-card rounded-2xl p-8 sm:p-10">
              <div className="prose max-w-none leading-relaxed text-gray-700">
                <RichText html={item.body} />
              </div>
            </div>
          ) : (
            <div className="aristocratic-card rounded-2xl p-8 text-center text-xs text-gray-500">
              Detailed documentation will be published shortly.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
