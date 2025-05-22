import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/editor"];
const publicRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect all /dashboard and /editor subroutes
  const isProtectedRoute = protectedRoutes.some(route =>
    path === route || path.startsWith(`${route}/`)
  );
  const isPublicRoute = publicRoutes.includes(path);

  // Use req.cookies in middleware
  const cookie = req.cookies.get("session")?.value;
  let isExpired = true;

  if (cookie) {
    try {
      const token = JSON.parse(atob(cookie.split('.')[1]));
      isExpired = token.exp * 1000 < Date.now();
    } catch (e) {
      isExpired = true;
    }
  }

  if (isProtectedRoute && isExpired) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If logged in, don't let you go to the login or register page
  if (isPublicRoute && !isExpired) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/login", "/register"],
};