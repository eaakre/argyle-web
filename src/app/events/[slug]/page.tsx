import { getEventBySlug, getAllEvents, SanityEvent } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  User,
  DollarSign,
} from "lucide-react";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((e: SanityEvent) => ({ slug: e.slug?.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return notFound();

  return generateSEOMetadata({
    title: `${event.title} – Argyle, MN`,
    description:
      event.description?.slice(0, 155) ||
      "Community event in Argyle, Minnesota.",
    canonicalUrl: `${domainUrl}/events/${slug}`,
    ogImage: event.image?.asset?.url || `${domainUrl}/argyle-drone.jpg`,
  });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCategory(cat: string) {
  return cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function buildGoogleCalendarUrl(event: SanityEvent) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const toGCal = (iso: string) => {
    const d = new Date(iso);
    return (
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
      `T${pad(d.getHours())}${pad(d.getMinutes())}00`
    );
  };
  const start = toGCal(event.date);
  const end = event.endDate ? toGCal(event.endDate) : toGCal(event.date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    ...(event.description && { details: event.description.slice(0, 500) }),
    ...(event.location && { location: event.location }),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  const date = new Date(event.date);
  const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = date.getDate();
  const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
  const isPast = new Date(event.date) < new Date();
  const gcalUrl = buildGoogleCalendarUrl(event);

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-text-secondary">
            <Link href="/" className="hover:text-text-hover">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/events" className="hover:text-text-hover">
              Events
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary">{event.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-accent">
        {event.image?.asset?.url && (
          <>
            <Image
              src={event.image.asset.url}
              alt={event.image.alt || event.title}
              fill
              priority
              className={`object-cover ${isPast ? "opacity-40" : "opacity-60"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </>
        )}
        {!event.image && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent/80 to-primary opacity-90" />
        )}

        {/* Decorative diagonal */}
        <div
          className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none"
          style={{
            background: "var(--secondary)",
            opacity: 0.12,
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 py-14 pb-16">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Date badge */}
            <div className="flex-shrink-0 bg-secondary text-primary text-center px-4 py-3 shadow-lg w-[72px]">
              <div className="text-[10px] font-extrabold tracking-widest leading-none mb-1">
                {month}
              </div>
              <div className="text-4xl font-black leading-none tracking-tight">
                {day}
              </div>
              <div className="text-[10px] font-semibold tracking-wider opacity-70 mt-1">
                {dayOfWeek}
              </div>
            </div>

            {/* Title + meta */}
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {event.category && (
                  <span className="text-xs px-2.5 py-0.5 bg-white/20 text-white rounded-full font-medium backdrop-blur-sm">
                    {formatCategory(event.category)}
                  </span>
                )}
                {event.featured && (
                  <span className="text-xs px-2.5 py-0.5 bg-secondary text-primary rounded-full font-bold">
                    Featured
                  </span>
                )}
                {isPast && (
                  <span className="text-xs px-2.5 py-0.5 bg-black/40 text-white/80 rounded-full">
                    Past Event
                  </span>
                )}
                {event.isFree && (
                  <span className="text-xs px-2.5 py-0.5 bg-green-500/30 text-green-200 rounded-full font-medium">
                    Free
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-2 drop-shadow-md">
                {event.title}
              </h1>
              {event.organizer && (
                <p className="text-white/70 text-sm">
                  Organized by {event.organizer}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Description */}
            <div className="md:col-span-2 space-y-4">
              {event.image?.asset?.url && (
                <div className="bg-bg-primary rounded-sm shadow-sm p-4">
                  <Image
                    src={event.image.asset.url}
                    alt={event.image.alt || event.title}
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[600px] object-contain rounded-sm"
                  />
                </div>
              )}
              {event.description ? (
                <div className="bg-bg-primary rounded-sm shadow-sm p-8">
                  <h2 className="text-xl font-bold mb-5 text-text-primary">
                    About This Event
                  </h2>
                  <p className="leading-relaxed whitespace-pre-line text-text-secondary">
                    {event.description}
                  </p>
                </div>
              ) : (
                <div className="bg-bg-primary rounded-sm shadow-sm p-8 text-text-secondary italic">
                  No description provided.
                </div>
              )}

              {/* Google Calendar CTA */}
              <div>
                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-sm hover:bg-accent transition-colors shadow-sm"
                >
                  <Calendar size={15} />
                  Add to Google Calendar
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Date & Time */}
              <div className="bg-bg-primary rounded-sm shadow-sm p-5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">
                  Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar
                      size={16}
                      className="flex-shrink-0 mt-0.5 text-accent"
                    />
                    <div>
                      <div className="text-sm font-medium">
                        {formatFullDate(event.date)}
                      </div>
                      {event.allDay ? (
                        <div className="text-xs text-text-secondary">
                          All Day
                        </div>
                      ) : (
                        <div className="text-xs text-text-secondary">
                          {formatTime(event.date)}
                          {event.endDate
                            ? ` – ${formatTime(event.endDate)}`
                            : ""}
                        </div>
                      )}
                      {event.endDate &&
                        formatFullDate(event.endDate) !==
                          formatFullDate(event.date) && (
                          <div className="text-xs text-text-secondary">
                            through {formatFullDate(event.endDate)}
                          </div>
                        )}
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={16}
                        className="flex-shrink-0 mt-0.5 text-accent"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {event.location}
                        </div>
                        {event.address && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-text-secondary hover:text-text-hover transition-colors"
                          >
                            {event.address}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {event.organizer && (
                    <div className="flex items-start gap-3">
                      <User
                        size={16}
                        className="flex-shrink-0 mt-0.5 text-accent"
                      />
                      <div className="text-sm">{event.organizer}</div>
                    </div>
                  )}

                  {(event.cost || event.isFree) && (
                    <div className="flex items-start gap-3">
                      <DollarSign
                        size={16}
                        className="flex-shrink-0 mt-0.5 text-accent"
                      />
                      <div className="text-sm font-medium">
                        {event.isFree ? "Free" : event.cost}
                      </div>
                    </div>
                  )}

                  {event.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone
                        size={16}
                        className="flex-shrink-0 text-accent"
                      />
                      <a
                        href={`tel:${event.contactPhone}`}
                        className="text-sm hover:text-text-hover transition-colors"
                      >
                        {event.contactPhone}
                      </a>
                    </div>
                  )}

                  {event.contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="flex-shrink-0 text-accent" />
                      <a
                        href={`mailto:${event.contactEmail}`}
                        className="text-sm hover:text-text-hover transition-colors break-all"
                      >
                        {event.contactEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration */}
              {event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-secondary text-primary font-bold text-sm rounded-sm shadow-sm hover:brightness-95 transition-all"
                >
                  <ExternalLink size={15} />
                  Register / Learn More
                </a>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-sm shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
