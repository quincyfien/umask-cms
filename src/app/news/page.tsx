import ContentListPage from "@/components/public/ContentListPage";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return (
    <ContentListPage
      title="News & Dispatches"
      type="NEWS"
      hrefPrefix="/news"
      subtitle="Institutional announcements, scientific breakthroughs, fellowship cohorts, and research press releases."
      searchParams={searchParams}
    />
  );
}
