import Link from "next/link";
import { getEventsHighlights } from "@/lib/sanity";

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function EventsHighlights() {
  const { featured, upcoming } = await getEventsHighlights();

  if (!featured && !upcoming.length) return null;

  const hasFeatured = !!featured;

  return (
    <section className="px-4 py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <Link
          href="/events"
          className="text-sm font-medium text-blue-700 hover:underline"
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
            <div className="h-full rounded-lg border border-green-300 bg-green-50 p-6 transition-shadow hover:shadow-md">
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide block mb-3">
                Featured Event
              </span>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 leading-snug mb-3">
                {featured.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                📅 {formatEventDate(featured.date)}
              </p>
              {featured.location && (
                <p className="text-sm text-gray-600 mb-3">
                  📍 {featured.location}
                </p>
              )}
              {featured.description && (
                <p className="text-sm text-gray-700 line-clamp-3">
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
                <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 leading-snug mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {formatEventDate(event.date)}
                  </p>
                  {event.location && (
                    <p className="text-xs text-gray-500">{event.location}</p>
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
              <div className="h-full rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 leading-snug mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  📅 {formatEventDate(event.date)}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-500">📍 {event.location}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
