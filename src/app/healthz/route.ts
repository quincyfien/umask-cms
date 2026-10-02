import { liveResponse } from "@/lib/health";

export async function GET() {
  return liveResponse();
}
