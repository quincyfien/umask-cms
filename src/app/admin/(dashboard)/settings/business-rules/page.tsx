import { requirePagePermission } from "@/lib/auth";
import BusinessRulesForm from "@/components/admin/BusinessRulesForm";

export default async function BusinessRulesPage() {
  await requirePagePermission("settings.manage");
  return <BusinessRulesForm />;
}
