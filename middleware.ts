import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  // Protect all /admin routes
  if (nextUrl.pathname.startsWith("/admin")) {
    // Allow /admin/login page (so user can actually log in)
    if (nextUrl.pathname === "/admin/login") return NextResponse.next();

    // If not logged in, redirect to login page
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
