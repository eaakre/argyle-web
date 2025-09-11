import { getPageBySlug } from "@/lib/sanity";
import { Hero } from "@/components/blocks/hero";
import { Gallery } from "@/components/blocks/gallery";
import { notFound } from "next/navigation";
import { GoogleMap } from "@/components/blocks/google-map";
import { generateSEOMetadata } from "@/lib/seo";
import { PageContentSlot } from "@/types/cms";

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
    <section className="space-y-8">
      {homepage.contentSlots?.map((slot: PageContentSlot, index: number) => {
        switch (slot._type) {
          case "hero":
            return <Hero key={index} {...slot} isHomepage={true} />;
          case "gallery":
            return <Gallery key={index} {...slot} />;
          case "googleMap":
            return <GoogleMap key={index} {...slot} />;
          default:
            return (
              <div key={index} className="border p-4 rounded">
                <pre>{JSON.stringify(slot, null, 2)}</pre>
              </div>
            );
        }
      })}
    </section>
  );
}
