import ContentForm from "@/components/admin/ContentForm";
import { requirePagePermission } from "@/lib/auth";

export default async function NewContentPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string }>;
}) {
  await requirePagePermission("content.create");
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5">
        <span className="text-[10px] font-mono text-brand uppercase tracking-wider">CONTENT EDITOR</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">New Content</h1>
        <p className="text-xs text-gray-400 mt-1">Create a new article, service, program, project, event, or resource.</p>
      </div>
      <div className="max-w-4xl">
        <ContentForm defaultType={params?.type} />
      </div>
    </div>
  );
}
