import { getPageBySlug } from "@/lib/sanity";
import { Hero } from "@/components/blocks/hero";
import { Gallery } from "@/components/blocks/gallery";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { PageContentSlot } from "@/types/cms";
import { TextBlock } from "@/components/blocks/textBlock";
import { domainUrl } from "@/lib/constants";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return notFound();

  return generateSEOMetadata({
    title: `${page.title}`,
    description:
      page.description ||
      "Argyle, Minnesota - putting the home in Hometown since 1879.",
    canonicalUrl: `${domainUrl}/${slug}`,
    ogImage: page.ogImage ? page.ogImageUrl : `${domainUrl}/default-og.jpg`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) return notFound();

  return (
    <section className="space-y-8 pb-10">
      {page.heading && <h1 className="sr-only">{page.heading}</h1>}
      {page.contentSlots?.map((slot: PageContentSlot, index: number) => {
        switch (slot._type) {
          case "hero":
            return <Hero key={index} {...slot} />;
          case "gallery":
            return <Gallery key={index} {...slot} />;
          case "textBlock":
            return <TextBlock key={index} {...slot} />;
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
