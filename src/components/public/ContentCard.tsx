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
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 bg-white p-5 transition hover:border-brand hover:shadow-sm"
    >
      <h3 className="font-semibold text-gray-900">{item.title}</h3>
      {showDate && item.publishedAt && (
        <p className="mt-1 text-xs text-gray-500">{formatDate(item.publishedAt)}</p>
      )}
      {item.summary && (
        <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
      )}
      {item.category && (
        <span className="mt-3 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {item.category.name}
        </span>
      )}
    </Link>
  );
}
