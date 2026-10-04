export function RichText({ html }: { html: string }) {
  return (
    <div
      className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
