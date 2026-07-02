import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCTION_HOSTS = ["ci.argyle.mn.us"];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isProduction = PRODUCTION_HOSTS.includes(host);

  if (!isProduction && request.nextUrl.pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain" },
    });
  }

  const response = NextResponse.next();

  if (!isProduction) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
