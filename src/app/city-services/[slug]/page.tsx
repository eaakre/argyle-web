import { getPageBySlug, getAllPages } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { ContentSlotsRenderer } from "@/components/ContentSlotRenderer";
import { domainUrl } from "@/lib/constants";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages
    .filter(
      (p: { slug?: { current?: string }; pathPrefix?: string }) =>
        p.slug?.current && p.pathPrefix === "city-services"
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
    canonicalUrl: `${domainUrl}/city-services/${slug}`,
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
