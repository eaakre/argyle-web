"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SanityEvent } from "@/lib/sanity";
import { CalendarGrid } from "./CalendarGrid";

const TZ = "America/Chicago";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getTodayKey(): string {
  // en-CA locale produces YYYY-MM-DD format
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

function getInitialMonth(): { year: number; month: number } {
  const key = getTodayKey();
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m - 1 };
}

interface EventCalendarProps {
  events: SanityEvent[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [activeMonth, setActiveMonth] = useState(getInitialMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const todayKey = useMemo(getTodayKey, []);

  const byDate = useMemo(() => {
    const map = new Map<string, SanityEvent[]>();
    for (const event of events) {
      const key = new Date(event.date).toLocaleDateString("en-CA", {
        timeZone: TZ,
      });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    return map;
  }, [events]);

  function prevMonth() {
    setActiveMonth((m) =>
      m.month === 0
        ? { year: m.year - 1, month: 11 }
        : { year: m.year, month: m.month - 1 },
    );
    setSelectedDate(null);
  }

  function nextMonth() {
    setActiveMonth((m) =>
      m.month === 11
        ? { year: m.year + 1, month: 0 }
        : { year: m.year, month: m.month + 1 },
    );
    setSelectedDate(null);
  }

  return (
    <section className="py-12 bg-bg-secondary">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="bg-bg-primary shadow-sm rounded-sm overflow-hidden">
          {/* Month header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-text-primary">
              {MONTH_NAMES[activeMonth.month]} {activeMonth.year}
            </h2>
            <div className="flex gap-1">
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-200 text-text-secondary hover:bg-bg-secondary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-200 text-text-secondary hover:bg-bg-secondary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <CalendarGrid
            year={activeMonth.year}
            month={activeMonth.month}
            todayKey={todayKey}
            byDate={byDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
      </div>
    </section>
  );
}
