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
    title: page.title || "City of Argyle",
    description:
      page.description ||
      "Welcome to Argyle, Minnesota - a charming small town in Marshall County. Discover local services, events, and businesses in 'The Home in Hometown.",
    canonicalUrl: `${domainUrl}/business/`,
    ogImage: page.ogImage ? page.ogImageUrl : `${domainUrl}/argyle-drone.jpg`,
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
        className="bg-bg-secondary mt-0"
      />
    </>
  );
}
