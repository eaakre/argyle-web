import Link from "next/link";
import Image from "next/image";
import { getEventsHighlights } from "@/lib/sanity";
import { SanityImage } from "@/types/cms";

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

interface EventsHighlightsProps {
  image?: SanityImage;
}

export async function EventsHighlights({ image }: EventsHighlightsProps) {
  const { upcoming } = await getEventsHighlights();

  if (!upcoming.length) return null;

  const imageUrl = image?.asset?.url;

  return (
    <section className="px-4 py-12 max-w-screen-xl mx-auto">
      {/* Header — indented on desktop to align with event cards */}
      <div className={`flex items-center justify-between mb-6 ${imageUrl ? "md:pl-44" : ""}`}>
        <h2 className="text-2xl font-bold text-text-primary">Upcoming Events</h2>
        <Link href="/events" className="text-sm font-medium text-primary hover:underline">
          See all events →
        </Link>
      </div>

      <div className="relative md:min-h-80">
        {/* Event cards — first in DOM so they appear above the circle on mobile.
            Desktop: pl-44 shifts them right to start at circle's midpoint (z-20).
            Mobile:  normal flow at top, z-20 keeps them in front of circle below. */}
        <div className={`relative z-20 flex flex-col gap-3 ${imageUrl ? "md:pl-44" : ""}`}>
          {upcoming.map((event) => (
            <Link
              key={event._id}
              href={event.customUrl ? event.customUrl : `/events/${event.slug.current}`}
              className="block group"
            >
              <div className="rounded-lg bg-white border border-text-primary/10 p-4 shadow-md transition-shadow hover:shadow-lg">
                <h3 className="font-semibold text-text-primary group-hover:text-primary leading-snug mb-1">
                  {event.title}
                </h3>
                <time dateTime={event.date} className="text-xs text-text-secondary block">
                  <span aria-hidden="true">📅</span> {formatEventDate(event.date)}
                </time>
                {event.location && (
                  <p className="text-xs text-text-secondary">
                    <span aria-hidden="true">📍</span> {event.location}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Circle image — second in DOM, pulled up behind events on mobile via negative top margin.
            Desktop: switches to absolute, vertically centered on the left (z-10). */}
        {imageUrl && (
          <div
            className={[
              "relative z-10 mx-auto -mt-12 w-48 h-48 rounded-full overflow-hidden",
              "md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 md:mt-0 md:mx-0 md:w-80 md:h-80",
            ].join(" ")}
          >
            <Image
              src={imageUrl}
              alt={image?.alt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 192px, 320px"
            />
          </div>
        )}
      </div>
    </section>
  );
}
