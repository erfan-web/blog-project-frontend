import { loginSchema } from "@/app/schemas/auth";
import { API_URL } from "@/lib/constants";
import { errorResponse, successResponse } from "@/lib/response";
import { ApiResponse, ValidationError } from "@/types/api";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    // validate request body
    const result = loginSchema.safeParse(await req.json());
    if (!result.success) {
      throw result.error;
    }
    const { email, password } = result.data;

    // call backend api to login
    const res = await fetch(`${API_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data: ApiResponse<string, string> = await res.json();
    if (!data.success) {
      return errorResponse(data.error ?? "Failed to login", res.status);
    }

    const response = successResponse(data.message);
    const backendCookie = res.headers.get("set-cookie");
    if (backendCookie) {
      response.headers.set("set-cookie", backendCookie);
    }

    return response;
  } catch (err) {
    if (err instanceof ZodError) {
      const issueses = err.issues.map((e) => ({
        field: e.path[0] as string,
        message: e.message,
      }));
      return errorResponse(issueses, 400);
    }
    if (err instanceof Error) {
      return errorResponse(err.message);
    }
    console.error(err);
    return errorResponse("Failed to login", 500);
  }
}
