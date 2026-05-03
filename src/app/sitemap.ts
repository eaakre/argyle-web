import type { MetadataRoute } from "next";
import { domainUrl } from "@/lib/constants";
import {
  getAllPages,
  getAllBusinesses,
  getAllEvents,
  getAllNewsArticles,
} from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, businesses, events, newsArticles] = await Promise.all([
    getAllPages(),
    getAllBusinesses(),
    getAllEvents(),
    getAllNewsArticles(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: domainUrl, priority: 1 },
    { url: `${domainUrl}/business` },
    { url: `${domainUrl}/contact` },
    { url: `${domainUrl}/events` },
    { url: `${domainUrl}/news` },
  ];

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((p: { slug?: { current?: string } }) => p.slug?.current)
    .map((p: { slug: { current: string }; pathPrefix?: string }) => {
      const prefix = p.pathPrefix ? `/${p.pathPrefix}` : "";
      return { url: `${domainUrl}${prefix}/${p.slug.current}` };
    });

  const businessRoutes: MetadataRoute.Sitemap = businesses
    .filter((b: { slug?: { current?: string } }) => b.slug?.current)
    .map((b: { slug: { current: string } }) => ({
      url: `${domainUrl}/business/${b.slug.current}`,
    }));

  const eventRoutes: MetadataRoute.Sitemap = events
    .filter((e: { slug?: { current?: string } }) => e.slug?.current)
    .map((e: { slug: { current: string } }) => ({
      url: `${domainUrl}/events/${e.slug.current}`,
    }));

  const newsRoutes: MetadataRoute.Sitemap = newsArticles
    .filter((n: { slug?: { current?: string } }) => n.slug?.current)
    .map((n: { slug: { current: string } }) => ({
      url: `${domainUrl}/news/${n.slug.current}`,
    }));

  return [
    ...staticRoutes,
    ...pageRoutes,
    ...businessRoutes,
    ...eventRoutes,
    ...newsRoutes,
  ];
}
