import { SanityEvent } from "@/lib/sanity";
import { CalendarCell } from "./CalendarCell";

const DOW_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface GridCell {
  year: number;
  month: number;
  day: number;
  isCurrentMonth: boolean;
}

function buildCells(year: number, month: number): GridCell[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
  const cells: GridCell[] = [];

  for (let i = 0; i < totalCells; i++) {
    const d = new Date(year, month, 1 - firstDow + i);
    cells.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
    });
  }

  return cells;
}

interface CalendarGridProps {
  year: number;
  month: number;
  todayKey: string;
  byDate: Map<string, SanityEvent[]>;
  selectedDate: string | null;
  onSelectDate: (key: string | null) => void;
}

export function CalendarGrid({
  year,
  month,
  todayKey,
  byDate,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const cells = buildCells(year, month);
  const totalRows = cells.length / 7;

  return (
    <div>
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DOW_FULL.map((d, i) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide"
          >
            <span className="hidden md:inline">{d}</span>
            <span className="md:hidden">{DOW_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 border-t border-l border-gray-100">
        {cells.map((cell, i) => {
          const dateKey = `${cell.year}-${String(cell.month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
          const events = byDate.get(dateKey) ?? [];
          const colIndex = i % 7;
          const rowIndex = Math.floor(i / 7);

          return (
            <CalendarCell
              key={dateKey + (cell.isCurrentMonth ? "" : "-other")}
              year={cell.year}
              month={cell.month}
              day={cell.day}
              isCurrentMonth={cell.isCurrentMonth}
              isToday={dateKey === todayKey}
              events={events}
              colIndex={colIndex}
              rowIndex={rowIndex}
              totalRows={totalRows}
              isSelected={selectedDate === dateKey}
              onOpen={() => onSelectDate(dateKey)}
              onClose={() => onSelectDate(null)}
            />
          );
        })}
      </div>
    </div>
  );
}
