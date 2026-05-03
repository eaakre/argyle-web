import type { MetadataRoute } from "next";
import { domainUrl } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${domainUrl}/sitemap.xml`,
  };
}
