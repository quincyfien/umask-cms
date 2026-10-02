import { getOrganization } from "@/lib/organization";
import { toErrorResponse } from "@/lib/http";

export async function GET() {
  try {
    return Response.json({ organization: await getOrganization() });
  } catch (err) {
    return toErrorResponse(err);
  }
}
