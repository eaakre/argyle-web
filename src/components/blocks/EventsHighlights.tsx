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
  const title = sectionTitle ?? "Upcoming Events";

  return (
    <section className="md:px-4 py-12 bg-bg-secondary">
      <div className="mx-auto max-w-screen-xl">
        {/* Mobile image — full width above carousel, hidden on desktop */}
        {imageUrl ? (
          <div className="relative h-48 w-full md:hidden overflow-hidden">
            <Image
              src={imageUrl}
              alt={image?.alt ?? ""}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute top-[20px] left-0 bg-primary/90 px-6 py-2">
              <h2 className="text-2xl font-bold text-white uppercase">
                {title}
              </h2>
            </div>
          </div>
        ) : (
          <h2 className="text-2xl font-bold text-bg-primary mb-6">{title}</h2>
        )}

        {/* Two-column layout */}
        <div className="flex bg-bg-primary min-h-80">
          {/* Left column: full-bleed image, desktop only */}
          {imageUrl && (
            <div className="relative hidden md:block md:w-3/5 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={image?.alt ?? ""}
                fill
                className="object-cover"
                sizes="60vw"
              />
              <div className="absolute top-[20px] left-[-10] bg-primary/90 px-12 py-2">
                <h2 className="text-2xl py-4 font-bold text-white uppercase">
                  {title}
                </h2>
              </div>
            </div>
          )}

          {/* Right column: carousel */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <EventsCarousel events={upcoming} />
          </div>
        </div>
      </div>
    </section>
  );
}
