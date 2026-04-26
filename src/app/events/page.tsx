import { getAllEvents, getPageBySlug } from "@/lib/sanity";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import { EventsDirectory } from "@/components/EventsDirectory";
import { ContentSlotsRenderer } from "@/components/ContentSlotRenderer";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const page = await getPageBySlug("events");
  if (!page) return notFound();

  return generateSEOMetadata({
    title: page.title || "Events | City of Argyle",
    description:
      page.description ||
      "Stay up to date with events and community happenings in Argyle, Minnesota.",
    canonicalUrl: `${domainUrl}/events/`,
    ogImage: page.ogImage ? page.ogImageUrl : `${domainUrl}/argyle-drone.jpg`,
  });
}

export default async function Page() {
  const [page, events] = await Promise.all([
    getPageBySlug("events"),
    getAllEvents(),
  ]);

  if (!page) return notFound();

  return (
    <>
      {page.heading && <h1 className="sr-only">{page.heading}</h1>}
      <ContentSlotsRenderer contentSlots={page.contentSlots} />
      <EventsDirectory events={events} />
    </>
  );
}
