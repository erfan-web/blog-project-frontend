import { postSchema } from "@/app/schemas/blog";
import { API_URL } from "@/lib/constants";
import { errorResponse, successResponse } from "@/lib/response";
import { ApiResponse } from "@/types/api";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { success, error, data } = postSchema.safeParse(await req.json());
  if (!success) {
    throw error;
  }
  try {
    const res = await fetch(`${API_URL}posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(data),
    });
    const result: ApiResponse<null, string> = await res.json();
    if (!result.success) {
      return errorResponse(result.error ?? "Failed to create post", res.status);
    }
    return successResponse(result.message ?? "Post created successfully");
  } catch (err) {
    if (err instanceof Error) {
      return errorResponse(err.message);
    }
    console.error(err);
    return errorResponse("Failed to create post", 500);
  }
}
