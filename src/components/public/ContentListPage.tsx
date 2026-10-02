import { prisma } from "@/lib/db";
import type { ContentType } from "@prisma/client";
import ContentCard from "./ContentCard";

type Props = {
  title: string;
  type: ContentType;
  hrefPrefix: string;
};

export default async function ContentListPage({ title, type, hrefPrefix }: Props) {
  const items = await prisma.contentItem.findMany({
    where: { type, status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
    orderBy:
      type === "EVENT"
        ? [{ startAt: "asc" }, { publishedAt: "desc" }]
        : [{ isPinned: "desc" }, { publishedAt: "desc" }],
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()} published yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              href={`${hrefPrefix}/${item.slug}`}
              showDate={type === "NEWS"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
