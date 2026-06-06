// lib/live.ts
// React Server Component only — uses the react-server export condition from
// next-sanity/live, which is unavailable in client components.
// Imported dynamically by sanityFetch in sanity.ts so that sanity.ts
// remains importable by client components (for types and urlForImage).
import { defineLive } from "next-sanity/live";
import { client } from "@/lib/sanity";

const { sanityFetch: liveFetch, SanityLive } = defineLive({
  client: client.withConfig({
    stega: { enabled: true, studioUrl: "https://argyle.sanity.studio" },
  }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
});

export { liveFetch, SanityLive };
