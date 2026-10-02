import { getOrganization } from "@/lib/organization";
import { prisma } from "@/lib/db";
import { RichText } from "@/components/public/RichText";

export default async function AboutPage() {
  const org = await getOrganization();
  const page = await prisma.contentItem.findFirst({
    where: { type: "PAGE", slug: "about", status: "PUBLISHED", accessLevel: "PUBLIC", deletedAt: null },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">About {org.name}</h1>
      <p className="mt-4 text-gray-700">{org.description}</p>
      {page?.body ? (
        <div className="mt-6">
          <RichText html={page.body} />
        </div>
      ) : (
        <p className="mt-6 text-gray-500">More about us is coming soon.</p>
      )}
    </div>
  );
}
