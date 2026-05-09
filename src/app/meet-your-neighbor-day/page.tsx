import { getMYNDEvent } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import { MYNDHero } from "@/components/mynd/MYNDHero";
import { MYNDGallery } from "@/components/mynd/MYNDGallery";
import { MYNDSchedule } from "@/components/mynd/MYNDSchedule";

export async function generateMetadata() {
  const event = await getMYNDEvent();
  if (!event) return {};
  return generateSEOMetadata({
    title: `${event.title} – Argyle, MN`,
    description:
      event.description?.slice(0, 155) ||
      "Meet Your Neighbor Day — a week of community events in Argyle, Minnesota.",
    canonicalUrl: `${domainUrl}/meet-your-neighbor-day`,
    ogImage: event.image?.asset?.url || `${domainUrl}/argyle-drone.jpg`,
  });
}

export default async function MeetYourNeighborDayPage() {
  const event = await getMYNDEvent();
  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-bg-secondary">
      <MYNDHero event={event} />
      {event.galleryImages && event.galleryImages.length > 0 && (
        <MYNDGallery images={event.galleryImages} />
      )}
      {event.subEvents && event.subEvents.length > 0 && (
        <MYNDSchedule subEvents={event.subEvents} />
      )}
    </div>
  );
}
