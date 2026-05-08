import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {

  // =========================
  // TOKEN
  // =========================
  const token =

    request.cookies.get("accessToken")?.value ||

    request.cookies.get("refreshToken")?.value;

  const pathname = request.nextUrl.pathname;

  // =========================
  // AUTH PAGES
  // =========================
  const isAuthPage =

    pathname.startsWith("/login") || pathname.startsWith("/register");

  // =========================
  // PROTECTED ROUTES
  // =========================
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
  }

  // =========================
  // ALREADY LOGGED IN
  // =========================
  if (token && isAuthPage) {

    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};