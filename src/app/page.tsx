import { getPageBySlug } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { ContentSlotsRenderer } from "@/components/ContentSlotRenderer";

export async function generateMetadata() {
  const page = await getPageBySlug("Homepage");
  if (!page) return notFound();

  return generateSEOMetadata({
    title: page.title || "City of Argyle",
    description:
      page.description ||
      "Discover beautiful, customizable homes built with care and precision. Start your journey to a smarter, more efficient home today.",
    canonicalUrl: `http://localhost:3000`,
    ogImage: page.ogImage
      ? page.ogImageUrl
      : "http://localhost:3000/default-og.jpg",
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
