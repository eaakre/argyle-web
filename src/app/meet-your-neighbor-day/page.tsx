import { getMYNDEvent, SanityEvent, SubEvent } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import { MYNDHero } from "@/components/mynd/MYNDHero";
import { MYNDGallery } from "@/components/mynd/MYNDGallery";
import { MYNDSchedule } from "@/components/mynd/MYNDSchedule";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

function getEventDateRange(subEvents: SubEvent[]) {
  const starts = subEvents.map((e) => new Date(e.startTime).getTime());
  const ends = subEvents.map((e) =>
    new Date(e.endTime ?? e.startTime).getTime(),
  );
  return {
    startDate: new Date(Math.min(...starts)).toISOString(),
    endDate: new Date(Math.max(...ends)).toISOString(),
  };
}

function buildEventJsonLd(event: SanityEvent) {
  const { startDate, endDate } = event.subEvents?.length
    ? getEventDateRange(event.subEvents)
    : { startDate: event.date, endDate: event.endDate };

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate,
    endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: event.description,
    image: event.image?.asset?.url ? [event.image.asset.url] : undefined,
    url: `${domainUrl}/meet-your-neighbor-day`,
    location: {
      "@type": "Place",
      name: "Argyle, MN",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Argyle",
        addressRegion: "MN",
        addressCountry: "US",
      },
    },
    subEvent: event.subEvents?.map((sub) => ({
      "@type": "Event",
      name: sub.title,
      description: sub.description,
      startDate: sub.startTime,
      endDate: sub.endTime,
      location: sub.locationName
        ? {
            "@type": "Place",
            name: sub.locationName,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Argyle",
              addressRegion: "MN",
            },
          }
        : undefined,
      offers: sub.isFree
        ? {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          }
        : undefined,
    })),
  };
}

export async function generateMetadata() {
  const event = await getMYNDEvent();
  if (!event) return {};
  return generateSEOMetadata({
    title: `${event.title} – Argyle, MN`,
    description:
      event.description?.slice(0, 155) ||
      "Meet Your Neighbor Day - a week of community events in Argyle, Minnesota.",
    canonicalUrl: `${domainUrl}/meet-your-neighbor-day`,
    ogImage: event.image?.asset?.url || `${domainUrl}/argyle-drone.jpg`,
  });
}

export default async function MeetYourNeighborDayPage() {
  const event = await getMYNDEvent();
  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-bg-secondary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildEventJsonLd(event)),
        }}
      />
      <MYNDHero event={event} />
      {event.image?.asset?.url && (
        <div className="bg-bg-secondary">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <ImageLightbox
                src={event.image.asset.url}
                alt={event.image.alt || event.title}
              />
            </div>
          </div>
        </div>
      )}
      {event.galleryImages && event.galleryImages.length > 0 && (
        <MYNDGallery images={event.galleryImages} />
      )}
      {event.subEvents && event.subEvents.length > 0 && (
        <MYNDSchedule subEvents={event.subEvents} />
      )}
    </div>
  );
}
