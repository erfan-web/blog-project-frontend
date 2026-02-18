import { API_URL } from "@/lib/constants";
import { errorResponse, successResponse } from "@/lib/response";
import { ApiResponse, SearchPost } from "@/types/api";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term") || "";
  const limit = searchParams.get("limit") || "5";
  try {
    const res = await fetch(
      `${API_URL}posts/search?term=${term}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    const result: ApiResponse<SearchPost[], string> = await res.json();
    if (!result.success) {
      if(res.status === 401) {
        return successResponse(undefined, result.error);
      }
      return errorResponse(result.error, res.status);
    }
    return successResponse(undefined, result.data);
  } catch (err) {
    return errorResponse("Failed to fetch data", 500);
  }
}
