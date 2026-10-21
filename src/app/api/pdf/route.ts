import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !url.startsWith("https://cdn.sanity.io/")) {
    return new Response("Invalid URL", { status: 400 });
  }

  const upstream = await fetch(url);
  if (!upstream.ok) {
    return new Response("Failed to fetch PDF", { status: 502 });
  }

  const buffer = await upstream.arrayBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
