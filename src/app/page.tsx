import { getPageBySlug } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { ContentSlotsRenderer } from "@/components/ContentSlotRenderer";
import { domainUrl } from "@/lib/constants";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: "City of Argyle",
  alternateName: "City of Argyle, Minnesota",
  url: domainUrl,
  logo: `${domainUrl}/logo.png`,
  image: `${domainUrl}/argyle-drone.jpg`,
  telephone: "+1-218-437-6621",
  email: "argyle@wiktel.com",
  foundingDate: "1879",
  address: {
    "@type": "PostalAddress",
    streetAddress: "701 Pacific Avenue",
    addressLocality: "Argyle",
    addressRegion: "MN",
    postalCode: "56713",
    addressCountry: "US",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    opens: "09:00",
    closes: "16:00",
  },
  sameAs: ["https://www.facebook.com/p/City-of-Argyle-100064809185972/"],
};

export async function generateMetadata() {
  const page = await getPageBySlug("Homepage");
  if (!page) return notFound();

  return generateSEOMetadata({
    title: page.title || "City of Argyle",
    description:
      page.description ||
      "Welcome to Argyle, Minnesota - a charming small town in Marshall County. Discover local services, events, and businesses in 'The Home in Hometown.",
    canonicalUrl: `${domainUrl}`,
    ogImage: page.socialImage?.asset?.url || `${domainUrl}/argyle-drone.jpg`,
  });
}

export default async function HomePage() {
  const homepage = await getPageBySlug("Homepage");

  if (!homepage) return notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {homepage.heading && <h1 className="sr-only">{homepage.heading}</h1>}
      <ContentSlotsRenderer
        contentSlots={homepage.contentSlots}
        isHomepage={true}
      />
    </>
  );
}
