import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ContentForm from "@/components/admin/ContentForm";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">CONTENT EDITOR</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Edit Content</h1>
        <p className="text-xs font-mono text-gray-400 mt-1">ID: {item.id}</p>
      </div>
      <div className="max-w-4xl">
        <ContentForm
          contentId={item.id}
          initial={{
            title: item.title,
            type: item.type,
            summary: item.summary,
            body: item.body,
            categoryId: item.categoryId,
            metaTitle: item.metaTitle,
            metaDescription: item.metaDescription,
          }}
        />
      </div>
    </div>
  );
}
