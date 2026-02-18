import { API_URL } from "@/lib/constants";
import { errorResponse, successResponse } from "@/lib/response";
import { ApiResponse, User } from "@/types/api";
import { cookies } from "next/headers";
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  try {
    // call backend api to login
    const res = await fetch(`${API_URL}auth/logout`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
    });
    const result: ApiResponse<undefined, string> = await res.json();
    if (!result.success) {
      return errorResponse(result.error || "Failed to logout");
    }
    const response = successResponse(result.message, undefined, 201);

    const backendCookie = res.headers.get("Set-Cookie");
    if (backendCookie) {
      response.headers.set("set-cookie", backendCookie);
    }

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return errorResponse(err.message);
    }
    return errorResponse("Failed to logout", 500);
  }
}
