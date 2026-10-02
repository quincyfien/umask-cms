import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ContentAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;
  const items = await prisma.contentItem.findMany({
    where: {
      deletedAt: null,
      ...(type ? { type: type as never } : {}),
      ...(status ? { status: status as never } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Content</h1>
        <Link href="/admin/content/new" className="rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          New content
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="px-4 py-2">
                  <Link href={`/admin/content/${item.id}`} className="text-brand hover:underline">
                    {item.title}
                  </Link>
                </td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2">{item.author?.name ?? "—"}</td>
                <td className="px-4 py-2">{item.updatedAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
