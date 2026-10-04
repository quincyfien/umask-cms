import ContentListPage from "@/components/public/ContentListPage";

export default function NewsPage() {
  return (
    <ContentListPage
      title="News & Dispatches"
      subtitle="Institutional announcements, scientific breakthroughs, fellowship cohorts, and research press releases."
      type="NEWS"
      hrefPrefix="/news"
    />
  );
}
