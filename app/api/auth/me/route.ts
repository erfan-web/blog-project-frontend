import { API_URL } from "@/lib/constants";
import { errorResponse, successResponse } from "@/lib/response";
import { ApiResponse, User } from "@/types/api";
import { cookies } from "next/headers";
export async function GET(req: Request) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  // call backend api to login
  const res = await fetch(`${API_URL}auth/me`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });
  const result: ApiResponse<User, undefined> = await res.json();
  if (result.success && result.data) {
    return successResponse(undefined, result.data);
  } else {
    return successResponse(undefined, null);
  }
}
