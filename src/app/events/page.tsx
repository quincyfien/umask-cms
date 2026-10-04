import ContentListPage from "@/components/public/ContentListPage";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return (
    <ContentListPage
      title="Events & Workshops"
      type="EVENT"
      hrefPrefix="/events"
      subtitle="Browse the schedule of research summits, technical workshops, and innovation showcases."
      searchParams={searchParams}
    />
  );
}
