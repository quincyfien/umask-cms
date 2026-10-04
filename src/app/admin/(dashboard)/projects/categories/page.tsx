import { prisma } from "@/lib/db";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function ProjectCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { type: "PROJECT" },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { contents: true },
      },
    },
  });

  return (
    <CategoryManager
      type="PROJECT"
      title="Project Disciplines & Categories"
      subtitle="Organize scientific initiatives, laboratory departments, and engineering domains."
      backHref="/admin/projects"
      initialCategories={categories}
    />
  );
}
