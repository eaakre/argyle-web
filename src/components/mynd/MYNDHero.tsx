import { SanityEvent } from "@/lib/sanity";
import { StyledLink } from "../ui/Link";

const TZ = "America/Chicago";

function formatDateRange(start: string, end?: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: TZ,
  };
  const startStr = new Date(start).toLocaleDateString("en-US", opts);
  if (!end) return startStr;
  return `${startStr} – ${new Date(end).toLocaleDateString("en-US", opts)}`;
}

export function MYNDHero({ event }: { event: SanityEvent }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-accent min-h-[420px] flex items-center">
      <div className="relative z-10 container mx-auto px-4 py-20 text-white text-center">
        <p className="text-sm tracking-widest uppercase opacity-70 mb-3">
          <time dateTime={event.date}>
            {formatDateRange(event.date, event.endDate)}
          </time>{" "}
          · Argyle, MN
        </p>
        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-md">
          {event.title}
        </h1>
        {event.description && (
          <p className="text-lg opacity-80 max-w-xl mx-auto mb-8">
            {event.description}
          </p>
        )}
        <StyledLink
          href="#schedule"
          variant="secondary"
          // className="inline-flex items-center gap-2 border-2 border-accent text-accent font-bold uppercase tracking-widest px-6 py-2 hover:bg-accent hover:text-bg-primary transition-colors"
        >
          See the Schedule ↓
        </StyledLink>
      </div>
    </div>
  );
}
