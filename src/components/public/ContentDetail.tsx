import type { ContentItem } from "@prisma/client";
import { RichText } from "./RichText";
import { formatDate, formatDateTime } from "@/lib/format";

export default function ContentDetail({
  item,
}: {
  item: ContentItem & { category?: { name: string } | null; author?: { name: string } | null };
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      {item.category && (
        <p className="text-sm font-medium text-brand">{item.category.name}</p>
      )}
      <h1 className="mt-2 text-3xl font-bold">{item.title}</h1>
      {item.summary && <p className="mt-3 text-lg text-gray-600">{item.summary}</p>}
      {item.publishedAt && (
        <p className="mt-2 text-sm text-gray-500">Published {formatDate(item.publishedAt)}</p>
      )}
      {item.author && <p className="text-sm text-gray-500">By {item.author.name}</p>}

      {item.type === "EVENT" && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
          {item.startAt && <p>Starts: {formatDateTime(item.startAt)}</p>}
          {item.endAt && <p>Ends: {formatDateTime(item.endAt)}</p>}
          {item.locationType === "PHYSICAL" && item.venueAddress && (
            <p>Venue: {item.venueAddress}</p>
          )}
          {item.locationType === "ONLINE" && item.onlineLink && <p>Join: {item.onlineLink}</p>}
        </div>
      )}

      {item.type === "PROGRAM" && item.programStatus && (
        <p className="mt-3 text-sm font-medium">Status: {item.programStatus}</p>
      )}

      {item.body && (
        <div className="mt-6">
          <RichText html={item.body} />
        </div>
      )}
    </article>
  );
}
