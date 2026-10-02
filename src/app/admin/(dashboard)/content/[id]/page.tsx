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
    <div>
      <h1 className="text-2xl font-bold">Edit content</h1>
      <div className="mt-6 max-w-2xl">
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
