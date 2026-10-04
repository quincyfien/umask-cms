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
    <Link href={href} className="block group">
      <div className="aristocratic-card p-6 rounded-2xl h-full flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            {item.category ? (
              <span className="inline-block rounded-full bg-brand/10 border border-brand/30 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-brand uppercase tracking-wider">
                {item.category.name}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">BTRC PUBLIC</span>
            )}
            {showDate && item.publishedAt && (
              <span className="text-[10px] font-mono text-gray-400">{formatDate(item.publishedAt)}</span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors leading-snug">
            {item.title}
          </h3>

          {item.summary && (
            <p className="mt-3 text-xs text-gray-300 leading-relaxed line-clamp-3">{item.summary}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-brand font-semibold uppercase tracking-wider">
          <span>Read Details</span>
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
