import Image from "next/image";
import { SanityEvent } from "@/lib/sanity";

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
      {event.image?.asset?.url && (
        <>
          <Image
            src={event.image.asset.url}
            alt={event.image.alt || event.title}
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </>
      )}
      <div className="relative z-10 container mx-auto px-4 py-20 text-white text-center">
        <p className="text-xs tracking-widest uppercase opacity-70 mb-3">
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
        <a
          href="#schedule"
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-primary font-bold rounded-sm hover:brightness-95 transition shadow-sm"
        >
          See the Schedule ↓
        </a>
      </div>
    </div>
  );
}
