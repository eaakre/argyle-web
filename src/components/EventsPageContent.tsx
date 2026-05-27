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
    <div className="py-2 bg-bg-secondary">
      <ViewToggle view={view} onViewChange={setView} />
      {view === "calendar" ? (
        <EventCalendar events={events} />
      ) : (
        <EventsDirectory events={events} />
      )}
    </div>
  );
}
