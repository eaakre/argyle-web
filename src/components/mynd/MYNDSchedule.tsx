"use client";

import { useState, useMemo } from "react";
import { MapPin, Clock } from "lucide-react";
import { SubEvent } from "@/lib/sanity";

const TZ = "America/Chicago";

const BORDER_HEX = ["#2d6a4f", "#1a3a5c", "#8b6914", "#6a1a6a", "#8b1a1a"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
}

function getTimeOfDay(iso: string): "morning" | "afternoon" | "evening" {
  const hour =
    parseInt(
      new Date(iso).toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: TZ,
      }),
    ) % 24;
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function MYNDSchedule({ subEvents }: { subEvents: SubEvent[] }) {
  const [timeFilter, setTimeFilter] = useState<
    "all" | "morning" | "afternoon" | "evening"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const categories = useMemo(() => {
    const set = new Set<string>();
    subEvents.forEach((e) => e.categories?.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [subEvents]);

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat, i) => {
      map[cat] = BORDER_HEX[i % BORDER_HEX.length];
    });
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    return [...subEvents]
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )
      .filter((e) => {
        if (timeFilter !== "all" && getTimeOfDay(e.startTime) !== timeFilter)
          return false;
        if (categoryFilter !== "all" && !e.categories?.includes(categoryFilter))
          return false;
        return true;
      });
  }, [subEvents, timeFilter, categoryFilter]);

  function borderColorFor(e: SubEvent) {
    const firstCat = e.categories?.[0];
    return firstCat ? categoryColorMap[firstCat] : "var(--color-accent)";
  }

  const pillBase =
    "px-3 py-1.5 rounded-full text-sm font-semibold transition-colors border";
  const pillActive =
    "bg-primary text-white border-primary dark:bg-secondary dark:text-bg-primary dark:border-secondary";
  const pillInactive =
    "bg-bg-primary text-text-secondary border-text-primary/20 hover:text-text-primary hover:border-text-primary/40";

  return (
    <section id="schedule" className="py-12 bg-bg-secondary">
      <div className="container max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Schedule</h2>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
              Time of Day
            </p>
            <div className="flex flex-wrap gap-2">
              {(["all", "morning", "afternoon", "evening"] as const).map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    aria-pressed={timeFilter === t}
                    className={`${pillBase} ${timeFilter === t ? pillActive : pillInactive}`}
                  >
                    {t === "all"
                      ? "All Day"
                      : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ),
              )}
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setCategoryFilter(categoryFilter === cat ? "all" : cat)
                    }
                    aria-pressed={categoryFilter === cat}
                    className={`${pillBase} capitalize ${
                      categoryFilter === cat
                        ? "bg-accent text-white border-accent dark:text-bg-primary dark:border-accent"
                        : pillInactive
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <p className="text-center text-text-secondary py-10">
            No events match your filters.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((event) => (
              <div
                key={event._key}
                className="flex gap-4 items-start bg-bg-primary rounded-sm shadow-sm px-4 py-4 border-l-4"
                style={{ borderLeftColor: borderColorFor(event) }}
              >
                {/* Time */}
                <div className="flex-shrink-0 flex items-center gap-1 text-sm font-bold text-text-secondary min-w-[72px] pt-0.5">
                  <Clock size={11} aria-hidden="true" className="opacity-60" />
                  {formatTime(event.startTime)}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-text-primary">
                      {event.title}
                    </span>
                    {event.isFree && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                        Free
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-text-secondary mb-1.5">
                      {event.description}
                    </p>
                  )}

                  {event.locationName && (
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      <MapPin
                        size={11}
                        aria-hidden="true"
                        className="flex-shrink-0 opacity-60"
                      />
                      {event.address ? (
                        <a
                          href={mapsUrl(event.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${event.locationName} – open in Google Maps`}
                          className="hover:text-text-hover transition-colors underline underline-offset-2"
                        >
                          {event.locationName}
                        </a>
                      ) : (
                        <span>{event.locationName}</span>
                      )}
                    </div>
                  )}

                  {event.categories && event.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs px-2 py-0.5 bg-bg-secondary text-text-secondary rounded-full capitalize"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* End time */}
                {event.endTime && (
                  <div className="flex-shrink-0 text-xs text-text-secondary pt-0.5 whitespace-nowrap">
                    ends {formatTime(event.endTime)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
