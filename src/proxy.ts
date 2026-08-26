import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const driverSession = request.cookies.get("sts_driver_session")?.value;
  const adminSession = request.cookies.get("sts_admin_session")?.value;
console.log("PROXY RUNNING:", request.nextUrl.pathname, !!driverSession);
  const pathname = request.nextUrl.pathname;

  const adminPaths = [
    "/dashboard",
    "/new-trip",
    "/trips",
    "/weekly-schedule",
    "/drivers",
    "/fleet",
    "/charter-parties",
    "/reports",
    "/settings",
  ];

  const isAdminPath = adminPaths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`${path}/`)
  );

  if (driverSession && !adminSession && isAdminPath) {
    return NextResponse.redirect(
      new URL("/driver", request.url)
    );
    
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/new-trip/:path*",
    "/trips/:path*",
    "/weekly-schedule/:path*",
    "/drivers/:path*",
    "/fleet/:path*",
    "/charter-parties/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};