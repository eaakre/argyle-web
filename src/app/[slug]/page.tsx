import { getPageBySlug } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { ContentSlotsRenderer } from "@/components/ContentSlotRenderer";
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
    <>
      {page.heading && <h1 className="sr-only">{page.heading}</h1>}
      <ContentSlotsRenderer contentSlots={page.contentSlots} />
    </>
  );
}
