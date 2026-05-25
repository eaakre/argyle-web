"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, X } from "lucide-react";
import { SanityEvent } from "@/lib/sanity";

const TZ = "America/Chicago";

function formatTime(dateStr: string, allDay?: boolean): string {
  if (allDay) return "All Day";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
}

interface EventPopoverProps {
  date: Date;
  events: SanityEvent[];
  openLeft: boolean;
  openAbove: boolean;
  onClose: () => void;
}

export function EventPopover({
  date,
  events,
  openLeft,
  openAbove,
  onClose,
}: EventPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  });

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`Events on ${dateLabel}`}
      onClick={(e) => e.stopPropagation()}
      className={[
        "absolute z-50 w-64 bg-bg-primary rounded-sm shadow-lg border border-gray-200",
        openAbove ? "bottom-full mb-1" : "top-full mt-1",
        openLeft ? "right-0" : "left-0",
      ].join(" ")}
    >
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide truncate">
          {dateLabel}
        </span>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {events.map((event) => {
          const href = event.customUrl ?? `/events/${event.slug.current}`;
          return (
            <div key={event._id} className="px-3 py-2.5">
              <div className="font-semibold text-sm text-text-primary mb-0.5 leading-snug">
                {event.title}
              </div>
              <div className="text-xs text-text-secondary mb-1 flex items-center gap-1 flex-wrap">
                <span>
                  {formatTime(event.date, event.allDay)}
                  {event.endDate && !event.allDay
                    ? ` – ${formatTime(event.endDate)}`
                    : ""}
                </span>
                {event.location && (
                  <span className="flex items-center gap-0.5">
                    <MapPin size={9} className="opacity-60 flex-shrink-0" />
                    {event.location}
                  </span>
                )}
              </div>
              <Link
                href={href}
                className="text-xs text-accent font-medium hover:underline"
              >
                View details →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
