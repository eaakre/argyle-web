"use client";

import { SanityEvent } from "@/lib/sanity";
import { EventPopover } from "./EventPopover";

function getCategoryColor(category?: string): string {
  switch (category) {
    case "government":
      return "bg-green-50 text-green-700";
    case "arts-culture":
    case "food-truck":
      return "bg-purple-50 text-purple-700";
    case "business":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-blue-50 text-blue-700";
  }
}

interface CalendarCellProps {
  year: number;
  month: number;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: SanityEvent[];
  colIndex: number;
  rowIndex: number;
  totalRows: number;
  isSelected: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function CalendarCell({
  year,
  month,
  day,
  isCurrentMonth,
  isToday,
  events,
  colIndex,
  rowIndex,
  totalRows,
  isSelected,
  onOpen,
  onClose,
}: CalendarCellProps) {
  const hasEvents = events.length > 0 && isCurrentMonth;
  // Popover opens leftward for last 3 columns (Thu=4, Fri=5, Sat=6)
  const openLeft = colIndex >= 4;
  // Popover opens upward for last 2 rows
  const openAbove = rowIndex >= totalRows - 2;

  return (
    <div
      role={hasEvents ? "button" : undefined}
      tabIndex={hasEvents ? 0 : undefined}
      aria-label={
        hasEvents
          ? `${new Date(year, month, day).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/Chicago" })}, ${events.length} event${events.length !== 1 ? "s" : ""}`
          : undefined
      }
      onClick={hasEvents ? onOpen : undefined}
      onKeyDown={
        hasEvents
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
      className={[
        "relative border-b border-r border-gray-100 min-h-[44px] md:min-h-[80px] p-1 transition-colors",
        hasEvents ? "cursor-pointer hover:bg-bg-secondary" : "",
        !isCurrentMonth ? "opacity-40" : "",
        isSelected && hasEvents ? "ring-1 ring-inset ring-accent" : "",
      ].join(" ")}
    >
      {/* Day number */}
      <div
        className={[
          "w-6 h-6 flex items-center justify-center text-xs font-medium mb-1",
          isToday
            ? "rounded-full bg-accent text-bg-primary"
            : "text-text-primary",
        ].join(" ")}
      >
        {day}
      </div>

      {/* Mobile: single dot */}
      {hasEvents && (
        <div className="md:hidden flex justify-center mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
      )}

      {/* Desktop: event name chips */}
      {hasEvents && (
        <div className="hidden md:flex flex-col gap-0.5">
          {events.map((event) => (
            <span
              key={event._id}
              className={`text-[10px] rounded px-1 py-0.5 truncate leading-tight ${getCategoryColor(event.category)}`}
            >
              {event.title}
            </span>
          ))}
        </div>
      )}

      {/* Popover */}
      {isSelected && hasEvents && (
        <EventPopover
          date={new Date(year, month, day)}
          events={events}
          openLeft={openLeft}
          openAbove={openAbove}
          onClose={onClose}
        />
      )}
    </div>
  );
}
