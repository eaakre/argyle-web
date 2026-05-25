"use client";

import { useState } from "react";
import { SanityEvent } from "@/lib/sanity";
import { ViewToggle } from "./ViewToggle";
import { EventCalendar } from "./EventCalendar";
import { EventsDirectory } from "./EventsDirectory";

type View = "calendar" | "list";

interface EventsPageContentProps {
  events: SanityEvent[];
}

export function EventsPageContent({ events }: EventsPageContentProps) {
  const [view, setView] = useState<View>("list");

  return (
    <>
      <div className="bg-bg-secondary border-b border-gray-100">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex justify-end">
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>
      {view === "calendar" ? (
        <EventCalendar events={events} />
      ) : (
        <EventsDirectory events={events} />
      )}
    </>
  );
}
