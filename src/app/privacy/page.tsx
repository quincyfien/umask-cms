export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-gray-700">
        <p>
          We collect only the personal data necessary to provide our services:
          applicant details, contact messages, newsletter subscriptions, event
          registrations and staff accounts.
        </p>
        <p>
          Contact messages are retained for 30 days after resolution. Event
          registrations are retained for 12 months after the event ends. Applicant
          data is deleted 6 months after a program closes. Newsletter data is kept
          while an active subscription exists.
        </p>
        <p>
          We use Cloudflare (edge protection), AWS (hosting and email) and Plausible
          (privacy-friendly analytics). For data requests, contact us via the contact
          page.
        </p>
      </div>
    </div>
  );
}
