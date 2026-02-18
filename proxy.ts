import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookies = request.cookies;
  const token = cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    if (pathname === "/blog" || pathname === "/create") {
      return NextResponse.redirect(
        new URL("/login?message=Please%20login", request.url),
      );
      // return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/sign-up") {
    return NextResponse.redirect(
      new URL("/?message=You%20are%20already%20logged%20in", request.url),
    );
    // return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/blog", "/create", "/login", "/sign-up"], // Specify the routes the middleware applies to
};
