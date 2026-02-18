"use server";
import { revalidatePath } from "next/cache";
import { commentSchema } from "./schemas/comment";
import z from "zod";
import { cookies } from "next/headers";
import {
  ApiError,
  ApiResponse,
  ApiSuccess,
  Comment,
  ValidationError,
} from "@/types/api";
import { API_URL } from "@/lib/constants";
export async function createComment(data: z.infer<typeof commentSchema>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${API_URL}comments`, {
    method: "POST",
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: ApiResponse<Comment, string | ValidationError[]> =
    await res.json();
  if (!result.success) {
    return { success: false, error: result.error } as ApiError<
      string | ValidationError[]
    >;
  }

  revalidatePath(`/blog/${data.postId}`);
  return {
    success: true,
    message: result.message,
    data: result.data,
  } as ApiSuccess<Comment>;
}
