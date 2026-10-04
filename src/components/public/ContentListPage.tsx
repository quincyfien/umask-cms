import { prisma } from "@/lib/db";
import type { ContentType } from "@prisma/client";
import ContentCard from "./ContentCard";

type Props = {
  title: string;
  type: ContentType;
  hrefPrefix: string;
  subtitle?: string;
};

export default async function ContentListPage({ title, type, hrefPrefix, subtitle }: Props) {
  const items = await prisma.contentItem.findMany({
    where: { type, status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
    orderBy:
      type === "EVENT"
        ? [{ startAt: "asc" }, { publishedAt: "desc" }]
        : [{ isPinned: "desc" }, { publishedAt: "desc" }],
    include: { category: true },
  });

  return (
    <div className="bg-ink text-paper min-h-screen">
      {/* Header Banner */}
      <section className="relative py-16 border-b border-brand/20 bg-gradient-to-b from-ink-light to-ink">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-mono tracking-super-wide text-brand uppercase font-semibold">
            RESEARCH COMMONS
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">{title}</h1>
          {subtitle && <p className="mt-3 text-gray-300 text-base max-w-2xl">{subtitle}</p>}
        </div>
      </section>

      {/* Grid Container */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {items.length === 0 ? (
            <div className="aristocratic-card p-12 text-center rounded-2xl max-w-xl mx-auto">
              <span className="text-brand font-mono text-2xl block mb-2">∅</span>
              <p className="text-gray-300 text-sm">No published {title.toLowerCase()} currently available.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </section>
    </div>
  );
}
