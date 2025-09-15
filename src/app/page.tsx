import { getPageBySlug } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { ContentSlotsRenderer } from "@/components/ContentSlotRenderer";
import { domainUrl } from "@/lib/constants";

export async function generateMetadata() {
  const page = await getPageBySlug("Homepage");
  if (!page) return notFound();

  return generateSEOMetadata({
    title: page.title || "City of Argyle",
    description:
      page.description ||
      "Welcome to Argyle, Minnesota - a charming small town in Marshall County. Discover local services, events, and businesses in 'The Home in Hometown.",
    canonicalUrl: `${domainUrl}`,
    ogImage: page.ogImage ? page.ogImageUrl : `${domainUrl}/argyle-drone.jpg`,
  });
}

export default async function HomePage() {
  const homepage = await getPageBySlug("Homepage");

  if (!homepage) return notFound();

  return (
    <>
      {homepage.heading && <h1 className="sr-only">{homepage.heading}</h1>}
      <ContentSlotsRenderer
        contentSlots={homepage.contentSlots}
        isHomepage={true}
      />
    </>
  );
}
