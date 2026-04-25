import { getAllEvents } from "@/lib/sanity";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import { EventsDirectory } from "@/components/EventsDirectory";
import { Calendar } from "lucide-react";

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Events – City of Argyle",
    description:
      "Stay up to date with events and community happenings in Argyle, Minnesota.",
    canonicalUrl: `${domainUrl}/events`,
    ogImage: `${domainUrl}/argyle-drone.jpg`,
  });
}

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      {/* Page header */}
      <div className="relative bg-primary text-white overflow-hidden py-16">
        <div
          className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
          style={{
            background: "var(--secondary)",
            opacity: 0.15,
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-36 h-36 pointer-events-none"
          style={{
            background: "var(--secondary)",
            opacity: 0.08,
            clipPath: "polygon(0 100%, 100% 100%, 0 0)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-secondary/20 rounded-sm">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3">Events</h1>
          <p className="text-white/60 text-lg max-w-md">
            Community happenings in Argyle, Minnesota
          </p>
        </div>
      </div>

      <EventsDirectory events={events} />
    </>
  );
}
