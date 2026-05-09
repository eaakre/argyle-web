import Link from "next/link";
import { getEventsHighlights } from "@/lib/sanity";

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

export async function EventsHighlights() {
  const { featured, upcoming } = await getEventsHighlights();

  if (!featured && !upcoming.length) return null;

  const hasFeatured = !!featured;

  return (
    <section className="px-4 py-12 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Upcoming Events</h2>
        <Link
          href="/events"
          className="text-sm font-medium text-primary hover:underline"
        >
          See all events →
        </Link>
      </div>

      {hasFeatured ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/events/${featured.slug.current}`}
            className="md:col-span-2 block group"
          >
            <div className="h-full rounded-lg border border-secondary/40 bg-secondary/15 p-6 transition-shadow hover:shadow-md">
              <span className="text-xs font-semibold text-badge-primary-text uppercase tracking-wide block mb-3">
                Featured Event
              </span>
              <h3 className="text-xl font-bold text-text-primary group-hover:text-primary leading-snug mb-3">
                {featured.title}
              </h3>
              <time dateTime={featured.date} className="text-sm text-text-secondary mb-1 block">
                <span aria-hidden="true">📅</span> {formatEventDate(featured.date)}
              </time>
              {featured.location && (
                <p className="text-sm text-text-secondary mb-3">
                  <span aria-hidden="true">📍</span> {featured.location}
                </p>
              )}
              {featured.description && (
                <p className="text-sm text-text-secondary line-clamp-3">
                  {featured.description}
                </p>
              )}
            </div>
          </Link>

          <div className="flex flex-col gap-3">
            {upcoming.slice(0, 2).map((event) => (
              <Link
                key={event._id}
                href={`/events/${event.slug.current}`}
                className="block group"
              >
                <div className="rounded-lg border border-text-primary/10 bg-bg-secondary p-4 transition-shadow hover:shadow-md">
                  <h4 className="font-semibold text-text-primary group-hover:text-primary leading-snug mb-1">
                    {event.title}
                  </h4>
                  <time dateTime={event.date} className="text-xs text-text-secondary block">
                    {formatEventDate(event.date)}
                  </time>
                  {event.location && (
                    <p className="text-xs text-text-secondary">{event.location}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcoming.slice(0, 3).map((event) => (
            <Link
              key={event._id}
              href={`/events/${event.slug.current}`}
              className="block group"
            >
              <div className="h-full rounded-lg border border-text-primary/10 bg-bg-secondary p-5 transition-shadow hover:shadow-md">
                <h3 className="font-semibold text-text-primary group-hover:text-primary leading-snug mb-2">
                  {event.title}
                </h3>
                <time dateTime={event.date} className="text-sm text-text-secondary mb-1 block">
                  <span aria-hidden="true">📅</span> {formatEventDate(event.date)}
                </time>
                {event.location && (
                  <p className="text-sm text-text-secondary">
                    <span aria-hidden="true">📍</span> {event.location}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
