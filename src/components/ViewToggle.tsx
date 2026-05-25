import { CalendarDays, List } from "lucide-react";

type View = "calendar" | "list";

interface ViewToggleProps {
  view: View;
  onChange: (v: View) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      className="flex gap-1 bg-bg-primary p-1 shadow-sm rounded-sm"
      role="group"
      aria-label="View toggle"
    >
      <button
        onClick={() => onChange("calendar")}
        aria-label="Calendar view"
        aria-pressed={view === "calendar"}
        className={`p-1.5 rounded-sm transition-all ${
          view === "calendar"
            ? "bg-tab-active-bg text-tab-active-text"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        <CalendarDays size={18} />
      </button>
      <button
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={view === "list"}
        className={`p-1.5 rounded-sm transition-all ${
          view === "list"
            ? "bg-tab-active-bg text-tab-active-text"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        <List size={18} />
      </button>
    </div>
  );
}
