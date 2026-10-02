import { prisma } from "@/lib/db";
import ContentCard from "@/components/public/ContentCard";

export default async function DownloadsPage() {
  const resources = await prisma.contentItem.findMany({
    where: { type: "RESOURCE", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Downloads & Resources</h1>
      {resources.length === 0 ? (
        <p className="text-gray-500">No resources published yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {resources.map((r) => (
            <ContentCard key={r.id} item={r} href={`/downloads/${r.slug}`} />
          ))}
        </div>
      )}
    </div>
  );
}
