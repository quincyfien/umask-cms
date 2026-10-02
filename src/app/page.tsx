import Link from "next/link";
import { prisma } from "@/lib/db";
import { getOrganization } from "@/lib/organization";
import ContentCard from "@/components/public/ContentCard";
import { formatDateTime } from "@/lib/format";

export default async function Home() {
  const org = await getOrganization();

  const [programs, events, news] = await Promise.all([
    prisma.contentItem.findMany({
      where: { type: "PROGRAM", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: true },
    }),
    prisma.contentItem.findMany({
      where: { type: "EVENT", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null, startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 3,
      include: { category: true },
    }),
    prisma.contentItem.findMany({
      where: { type: "NEWS", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: true },
    }),
  ]);

  return (
    <div>
      <section className="bg-charcoal py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl font-bold">{org.name}</h1>
          <p className="mt-3 text-lg text-brand">{org.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        {programs.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Programs</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {programs.map((p) => (
                <ContentCard key={p.id} item={p} href={`/programs/${p.slug}`} />
              ))}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Upcoming Events</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {events.map((e) => (
                <div key={e.id} className="rounded-lg border border-gray-200 bg-white p-5">
                  <h3 className="font-semibold">
                    <Link href={`/events/${e.slug}`} className="hover:text-brand">
                      {e.title}
                    </Link>
                  </h3>
                  {e.startAt && (
                    <p className="mt-1 text-xs text-gray-500">{formatDateTime(e.startAt)}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {news.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Latest News</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {news.map((n) => (
                <ContentCard key={n.id} item={n} href={`/news/${n.slug}`} showDate />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
