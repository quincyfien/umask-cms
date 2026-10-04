import { prisma } from "@/lib/db";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function NewsCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { type: "NEWS" },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { contents: true },
      },
    },
  });

  return (
    <CategoryManager
      type="NEWS"
      title="News & Press Categories"
      subtitle="Organize editorial topics, press releases, scientific discoveries, and institutional statements."
      backHref="/admin/content"
      initialCategories={categories}
    />
  );
}
