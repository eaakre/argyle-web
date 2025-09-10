// lib/seo.ts
import type { Metadata } from "next";

type GenerateSEOMetadataProps = {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
};

export function generateSEOMetadata({
  title,
  description,
  canonicalUrl,
  ogImage,
}: GenerateSEOMetadataProps): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}
