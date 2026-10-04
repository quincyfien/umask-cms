import ContentListPage from "@/components/public/ContentListPage";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return (
    <ContentListPage
      title="Programs & Fellowships"
      type="PROGRAM"
      hrefPrefix="/programs"
      subtitle="Explore research fellowships, internship tracks, bootcamps, and funded residency programs."
      searchParams={searchParams}
    />
  );
}
