import { prisma } from "@/lib/db";

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    where: { deletedAt: null },
    orderBy: { uploadedAt: "desc" },
    take: 100,
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Media</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Access</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id} className="border-b border-gray-100">
                <td className="px-4 py-2">{a.fileName}</td>
                <td className="px-4 py-2">{a.mimeType}</td>
                <td className="px-4 py-2">{a.size}</td>
                <td className="px-4 py-2">{a.status}</td>
                <td className="px-4 py-2">{a.access}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
