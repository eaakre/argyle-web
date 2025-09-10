import { getPageBySlug } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { ContentSlotsRenderer } from "@/components/ContentSlotRenderer";
import { domainUrl } from "@/lib/constants";
import { BusinessesSection } from "@/components/blocks/businessSection";

export async function generateMetadata() {
  const page = await getPageBySlug("business");
  if (!page) return notFound();

  return generateSEOMetadata({
    title: `${page.title}`,
    description:
      page.description ||
      "Argyle, Minnesota - putting the home in Hometown since 1879.",
    canonicalUrl: `${domainUrl}/${"business"}`,
    ogImage: page.ogImage ? page.ogImageUrl : `${domainUrl}/default-og.jpg`,
  });
}

export default async function Page() {
  const page = await getPageBySlug("business");

  if (!page) return notFound();

  return (
    <>
      {page.heading && <h1 className="sr-only">{page.heading}</h1>}
      <ContentSlotsRenderer contentSlots={page.contentSlots} />
      <BusinessesSection
        title="Local Businesses"
        showFeaturedFirst={true}
        className="bg-bg-secondary"
      />
    </>
  );
}
