export function RichText({ html }: { html: string }) {
  return (
    <div
      className="leading-relaxed space-y-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
