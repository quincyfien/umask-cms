import { readyResponse } from "@/lib/health";

export async function GET() {
  return readyResponse();
}
