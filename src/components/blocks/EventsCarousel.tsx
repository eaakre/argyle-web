"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SanityEvent } from "@/lib/sanity";
import { MapPin, Calendar } from "lucide-react";

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

type EventSlide = Pick<
  SanityEvent,
  "_id" | "title" | "date" | "location" | "slug" | "customUrl"
>;

interface EventsCarouselProps {
  events: EventSlide[];
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const isInitialMount = useRef(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setAnnouncement(
      `Event ${selectedIndex + 1} of ${events.length}: ${events[selectedIndex].title}`,
    );
  }, [selectedIndex, events]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!events.length) return null;

  return (
    <div
      className="flex flex-col h-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Upcoming events"
    >
      {/* Screen reader live announcement */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden flex-1" ref={emblaRef}>
        <div className="flex h-full">
          {events.map((event, i) => (
            <div
              key={event._id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${events.length}`}
              aria-hidden={i !== selectedIndex ? true : undefined}
              {...(i !== selectedIndex ? { inert: true } : {})}
              className="flex-[0_0_100%] min-w-0 px-8 py-8 flex flex-col justify-center border-r-2 border-accent"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-3 block">
                Upcoming Event
              </span>
              <h3 className="text-2xl font-extrabold text-text-primary uppercase leading-tight mb-3">
                {event.title}
              </h3>
              <div className="flex flex-col gap-1 mb-6">
                <time
                  dateTime={event.date}
                  className="text-sm text-text-secondary"
                >
                  <span aria-hidden="true">
                    <Calendar
                      size={16}
                      className="inline-flex flex-shrink-0 mt-0.5 text-accent"
                    />
                  </span>{" "}
                  {formatEventDate(event.date)}
                </time>
                {event.location && (
                  <p className="text-sm text-text-secondary">
                    <span aria-hidden="true">
                      <MapPin
                        size={16}
                        className="inline-flex flex-shrink-0 mt-0.5 text-accent"
                      />
                    </span>{" "}
                    {event.location}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={event.customUrl ?? `/events/${event.slug.current}`}
                  className="inline-block border-2 border-accent text-accent text-sm font-bold uppercase tracking-widest px-6 py-2 hover:bg-accent hover:text-bg-primary transition-colors"
                  aria-label={`View details for ${event.title}`}
                >
                  View Details
                </Link>
                <Link
                  href="/events"
                  className="text-sm font-medium text-text-secondary hover:underline"
                >
                  See all events →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls: prev arrow · dots · next arrow */}
      <div className="flex items-center gap-3 px-8 pb-6">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous event"
          className={`w-8 h-8 cursor-pointer disabled:cursor-default rounded-full border border-text-text-primary/20 flex items-center justify-center text-text-primary transition-opacity ${
            !canScrollPrev
              ? "opacity-40"
              : "hover:border-primary hover:text-primary"
          }`}
        >
          ‹
        </button>

        <div className="flex gap-2" aria-hidden="true">
          {events.map((_, i) => (
            <span
              key={events[i]._id}
              className={`block w-2.5 h-2.5 rounded-full transition-colors ${
                i === selectedIndex
                  ? "bg-text-primary"
                  : "bg-text-primary/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next event"
          className={`w-8 h-8 cursor-pointer disabled:cursor-default rounded-full border border-text-text-primary/20 flex items-center justify-center text-text-primary transition-opacity ${
            !canScrollNext
              ? "opacity-40"
              : "hover:border-primary hover:text-text-primary"
          }`}
        >
          ›
        </button>
      </div>
    </div>
  );
}
