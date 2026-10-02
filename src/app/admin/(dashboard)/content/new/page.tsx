import ContentForm from "@/components/admin/ContentForm";

export default function NewContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New content</h1>
      <div className="mt-6 max-w-2xl">
        <ContentForm />
      </div>
    </div>
  );
}
