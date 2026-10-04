import ContentListPage from "@/components/public/ContentListPage";

export default function Page() {
  return (
    <ContentListPage
      title="Research Projects"
      type="PROJECT"
      hrefPrefix="/projects"
      subtitle="Explore BTRC's active, completed, and upcoming technology research deployments across AI, Robotics, IoT, Energy, and Telemetry."
    />
  );
}
