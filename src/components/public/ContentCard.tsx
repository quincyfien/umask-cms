import Link from "next/link";
import type { ContentItem } from "@prisma/client";
import { formatDate } from "@/lib/format";

type CardProps = {
  item: ContentItem & { category?: { name: string } | null };
  href: string;
  showDate?: boolean;
};

export default function ContentCard({ item, href, showDate }: CardProps) {
  return (
    <Link href={href} className="group block">
      <div className="aristocratic-card flex h-full flex-col justify-between overflow-hidden rounded-2xl">
        {item.featuredImageId && (
          <img
            src={`/api/media/${item.featuredImageId}`}
            alt={item.title}
            className="h-40 w-full object-cover"
          />
        )}
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            {item.category && (
              <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand">
                {item.category.name}
              </span>
            )}
            {showDate && item.publishedAt && (
              <span className="font-mono text-[10px] text-gray-400">{formatDate(item.publishedAt)}</span>
            )}
          </div>

          <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand">
            {item.title}
          </h3>

          {item.summary && (
            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-gray-600">{item.summary}</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-black/10 px-6 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-brand">
          <span>Read Details</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
