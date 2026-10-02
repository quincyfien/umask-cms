import { getCurrentUser } from "@/lib/auth";
import { toErrorResponse, problem } from "@/lib/http";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return problem(401, "UNAUTHENTICATED", "You must be signed in.");
    }
    return Response.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin,
      permissions: [...user.permissions],
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
