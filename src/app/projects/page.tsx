import ContentListPage from "@/components/public/ContentListPage";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return (
    <ContentListPage
      title="Research Projects"
      type="PROJECT"
      hrefPrefix="/projects"
      subtitle="Explore active, completed, and upcoming technology research deployments across AI, Robotics, IoT, Energy, and Telemetry."
      searchParams={searchParams}
    />
  );
}
