import type { MetadataRoute } from "next";
import { domainUrl } from "@/lib/constants";

// Static — the staging host is kept out of search results via the
// X-Robots-Tag header set in middleware.ts, not via this file.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${domainUrl}/sitemap.xml`,
  };
}
