import type { NextConfig } from "next";

async function getBusinessSlugs(): Promise<string[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  if (!projectId) return [];
  const query = encodeURIComponent(`*[_type == "business"].slug.current`);
  const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return (json.result ?? []).filter(Boolean);
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  async redirects() {
    const slugs = await getBusinessSlugs();
    return slugs.map((slug) => ({
      source: `/${slug}`,
      destination: `/business/${slug}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
