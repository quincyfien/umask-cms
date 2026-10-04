import ContentListPage from "@/components/public/ContentListPage";

export default function Page() {
  return (
    <ContentListPage
      title="Events & Workshops"
      type="EVENT"
      hrefPrefix="/events"
      subtitle="Browse BTRC's schedule of research summits, technical workshops, and innovation showcases. Register or RSVP directly online."
    />
  );
}
