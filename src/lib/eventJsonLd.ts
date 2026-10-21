import { SanityEvent, SubEvent } from "@/lib/sanity";

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

// Builds schema.org Event JSON-LD for a Sanity event. `url` is the
// canonical page URL for this event (differs for the MYND landing page,
// which uses a customUrl instead of /events/[slug]).
export function buildEventJsonLd(event: SanityEvent, url: string) {
  const { startDate, endDate } = event.subEvents?.length
    ? getEventDateRange(event.subEvents)
    : { startDate: event.date, endDate: event.endDate };

  const location = event.location
    ? {
        "@type": "Place",
        name: event.location,
        address: {
          "@type": "PostalAddress",
          ...(event.address && { streetAddress: event.address }),
          addressLocality: "Argyle",
          addressRegion: "MN",
          addressCountry: "US",
        },
      }
    : {
        "@type": "Place",
        name: "Argyle, MN",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Argyle",
          addressRegion: "MN",
          addressCountry: "US",
        },
      };

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
    url,
    location,
    organizer: event.organizer
      ? { "@type": "Organization", name: event.organizer }
      : undefined,
    // Only free events get a well-formed Offer — "cost" is free text
    // (e.g. "$15 entry") and can't be mapped to a valid numeric price.
    offers: event.isFree
      ? {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url,
        }
      : undefined,
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
