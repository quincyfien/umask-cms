export function RichText({ html }: { html: string }) {
  return (
    <div
      className="prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
