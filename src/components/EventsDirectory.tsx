"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Search, Calendar } from "lucide-react";
import { SanityEvent } from "@/lib/sanity";

function formatCategory(cat: string) {
  return cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

const TZ = "America/Chicago";

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date();
}

function EventCard({ event }: { event: SanityEvent }) {
  const date = new Date(event.date);
  const month = date
    .toLocaleString("en-US", { month: "short", timeZone: TZ })
    .toUpperCase();
  const day = Number(
    date.toLocaleString("en-US", { day: "numeric", timeZone: TZ }),
  );
  const dayOfWeek = date.toLocaleString("en-US", {
    weekday: "short",
    timeZone: TZ,
  });
  const past = !isUpcoming(event.date);

  return (
    <Link
      href={event.customUrl ?? `/events/${event.slug.current}`}
      className="group block bg-bg-primary rounded-sm shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image / color band — wrapper is relative so badge can escape overflow-hidden */}
      <div className="relative">
        <div className="relative h-44 overflow-hidden rounded-t-sm bg-gradient-to-br from-primary to-accent">
          {event.image?.asset?.url && (
            <Image
              src={event.image.asset.url}
              alt={event.image.alt || event.title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${past ? "opacity-50" : ""}`}
            />
          )}
          {past && <div className="absolute inset-0 bg-black/20" />}
          {event.featured && (
            <span className="absolute top-3 right-3 badge badge-secondary font-bold shadow">
              Featured
            </span>
          )}
          {past && (
            <span className="absolute top-3 left-3 text-xs px-2.5 py-0.5 bg-black/60 text-white/90 rounded-full font-medium">
              Past
            </span>
          )}
        </div>

        {/* Date badge — outside overflow-hidden so it renders fully */}
        <div className="absolute bottom-0 left-4 translate-y-1/2 z-20 bg-badge-secondary-bg text-badge-secondary-text shadow-md text-center min-w-[52px] px-2.5 py-1.5">
          <div className="text-[11px] font-extrabold tracking-widest leading-none mb-0.5">
            {month}
          </div>
          <div className="text-[26px] font-black leading-none tracking-tight">
            {day}
          </div>
          <div className="text-[11px] font-semibold tracking-wider opacity-70 mt-0.5">
            {dayOfWeek}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 pb-5 px-4">
        <h3 className="font-bold text-base leading-snug mb-2.5 line-clamp-2 group-hover:text-accent transition-colors">
          {event.title}
        </h3>

        <div className="space-y-1 mb-3">
          {event.location && (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <MapPin size={11} className="flex-shrink-0 opacity-60" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.allDay ? (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Calendar size={11} className="flex-shrink-0 opacity-60" />
              <span>All Day</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Clock size={11} className="flex-shrink-0 opacity-60" />
              <span>
                {formatTime(event.date)}
                {event.endDate ? ` – ${formatTime(event.endDate)}` : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {event.category && (
            <span className="badge badge-neutral">
              {formatCategory(event.category)}
            </span>
          )}
          {event.isFree && (
            <span className="badge badge-neutral font-semibold">Free</span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface EventsDirectoryProps {
  events: SanityEvent[];
}

export function EventsDirectory({ events }: EventsDirectoryProps) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"upcoming" | "all" | "past">("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    events.forEach((e) => {
      if (e.category) cats.add(e.category);
    });
    return Array.from(cats).sort();
  }, [events]);

  const months = useMemo(() => {
    const seen = new Set<string>();
    events.forEach((e) => {
      const d = new Date(e.date);
      seen.add(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      );
    });
    return Array.from(seen).sort();
  }, [events]);

  const tabCounts = useMemo(
    () => ({
      upcoming: events.filter((e) => isUpcoming(e.date)).length,
      all: events.length,
      past: events.filter((e) => !isUpcoming(e.date)).length,
    }),
    [events],
  );

  const filtered = useMemo(() => {
    let result = events;

    if (tab === "upcoming") result = result.filter((e) => isUpcoming(e.date));
    if (tab === "past") result = result.filter((e) => !isUpcoming(e.date));

    if (selectedCategory !== "all")
      result = result.filter((e) => e.category === selectedCategory);

    if (selectedMonth !== "all") {
      result = result.filter((e) => {
        const d = new Date(e.date);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return ym === selectedMonth;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q),
      );
    }

    return [...result].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return tab === "past" ? -diff : diff;
    });
  }, [events, tab, selectedCategory, selectedMonth, search]);

  return (
    <section className="py-12 bg-bg-secondary">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Tab row */}
        <div className="flex gap-1 mb-6 bg-bg-primary p-1 w-full md:w-fit shadow-sm rounded-sm">
          {(["upcoming", "all", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-semibold rounded-sm transition-all ${
                tab === t
                  ? "bg-tab-active-bg text-tab-active-text"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t === "upcoming" ? "Upcoming" : t === "all" ? "All" : "Past"}
              <span
                className={`ml-1.5 text-sm font-normal ${
                  tab === t ? "text-tab-active-text/60" : "text-text-secondary"
                }`}
              >
                ({tabCounts[t]})
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategory(cat)}
                </option>
              ))}
            </select>
          )}

          {months.length > 1 && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Months</option>
              {months.map((ym) => {
                const [year, month] = ym.split("-");
                const label = new Date(
                  Number(year),
                  Number(month) - 1,
                ).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                });
                return (
                  <option key={ym} value={ym}>
                    {label}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-text-secondary">
            <Calendar className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No events found.</p>
            {tab === "upcoming" && (
              <p className="text-sm mt-1 opacity-70">
                Check back soon or view past events.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
            {filtered.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-sm text-text-secondary mt-10">
            Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </section>
  );
}
