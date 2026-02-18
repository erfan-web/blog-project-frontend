export function successResponse<T>(message?: string, data?: T, status = 200) {
  return Response.json(
    { success: true, message: message ?? "Logged in successfully", data },
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export function errorResponse<T>(error: T, status = 400) {
  return Response.json(
    { success: false, error },
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
