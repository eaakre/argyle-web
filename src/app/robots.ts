import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { domainUrl } from "@/lib/constants";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  const isProduction = host === "ci.argyle.mn.us";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${domainUrl}/sitemap.xml`,
  };
}
