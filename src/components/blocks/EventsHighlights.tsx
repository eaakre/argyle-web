import Link from "next/link";
import Image from "next/image";
import { getEventsHighlights } from "@/lib/sanity";
import { SanityImage } from "@/types/cms";
import { EventsCarousel } from "./EventsCarousel";

interface EventsHighlightsProps {
  image?: SanityImage;
  sectionTitle?: string;
}

export async function EventsHighlights({
  image,
  sectionTitle,
}: EventsHighlightsProps) {
  const { upcoming } = await getEventsHighlights();

  if (!upcoming.length) return null;

  const imageUrl = image?.asset?.url;

  return (
    <section className="px-4 py-12 max-w-screen-xl mx-auto">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          {sectionTitle ?? "Upcoming Events"}
        </h2>
        <Link
          href="/events"
          className="text-sm font-medium text-primary hover:underline"
        >
          See all events →
        </Link>
      </div>

      {/* Mobile image — full width above carousel, hidden on desktop */}
      {imageUrl && (
        <div className="relative h-48 w-full md:hidden overflow-hidden">
          <Image
            src={imageUrl}
            alt={image?.alt ?? ""}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex bg-bg-secondary overflow-hidden min-h-64">
        {/* Left column: full-bleed image, desktop only */}
        {imageUrl && (
          <div className="relative hidden md:block md:w-2/5 flex-shrink-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt={image?.alt ?? ""}
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        )}

        {/* Right column: carousel */}
        <div className="flex-1 min-w-0">
          <EventsCarousel events={upcoming} />
        </div>
      </div>
    </section>
  );
}
