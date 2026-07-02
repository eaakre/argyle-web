import { getPageBySlug, getAllPages } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { ContentSlotsRenderer } from "@/components/ContentSlotRenderer";
import { domainUrl } from "@/lib/constants";
import fs from "fs";
import path from "path";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Sibling top-level routes (their own page.tsx under src/app) must be
// excluded here, or generateStaticParams would emit a colliding /[slug]
// page at the same output path, overwriting the real route's static build.
// Derived from the filesystem so new routes don't need a manual update.
function getReservedSlugs(): string[] {
  const appDir = path.join(process.cwd(), "src", "app");
  return fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        entry.name !== "api" &&
        !entry.name.startsWith("[") &&
        !entry.name.startsWith("(") &&
        (fs.existsSync(path.join(appDir, entry.name, "page.tsx")) ||
          fs.existsSync(path.join(appDir, entry.name, "page.ts")))
    )
    .map((entry) => entry.name);
}

export async function generateStaticParams() {
  const pages = await getAllPages();
  const reservedSlugs = getReservedSlugs();
  return pages
    .filter(
      (p: { slug?: { current?: string }; pathPrefix?: string }) =>
        p.slug?.current &&
        !p.pathPrefix &&
        !reservedSlugs.includes(p.slug.current)
    )
    .map((p: { slug: { current: string } }) => ({ slug: p.slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return notFound();

  return generateSEOMetadata({
    title: page.title || "City of Argyle",
    description:
      page.description ||
      "Welcome to Argyle, Minnesota - a charming small town in Marshall County. Discover local services, events, and businesses in 'The Home in Hometown.",
    canonicalUrl: `${domainUrl}/${slug}`,
    ogImage: page.ogImage ? page.ogImageUrl : `${domainUrl}/argyle-drone.jpg`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) return notFound();

  return (
    <>
      {page.heading && <h1 className="sr-only">{page.heading}</h1>}
      <ContentSlotsRenderer contentSlots={page.contentSlots} />
    </>
  );
}
