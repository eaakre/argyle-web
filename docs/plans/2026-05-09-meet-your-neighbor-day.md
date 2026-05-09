# Meet Your Neighbor Day Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated `/meet-your-neighbor-day` landing page with a filterable sub-event schedule, horizontal photo gallery, and hero section — all driven by an extended Sanity event document.

**Architecture:** Extend the existing `event` Sanity schema with three optional fields (`customUrl`, `galleryImages[]`, `subEvents[]`). A new server component page at `src/app/meet-your-neighbor-day/page.tsx` fetches the MYND event by slug and renders three new client components. The existing `EventCard` is patched to redirect to `customUrl` when present.

**Tech Stack:** Next.js 15 App Router, Sanity CMS, TypeScript, Tailwind CSS v4. No new npm dependencies.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `studio/schemaTypes/event.ts` | Add `customUrl`, `galleryImages`, `subEvents` fields |
| Modify | `src/lib/sanity.ts` | Add `SubEvent` type, extend `SanityEvent`, add `customUrl` to `EVENT_FIELDS`, add `getMYNDEvent()` |
| Modify | `src/components/EventsDirectory.tsx` | Use `event.customUrl` in `EventCard` when present |
| Create | `src/components/mynd/MYNDHero.tsx` | Hero section — image, title, date range, CTA |
| Create | `src/components/mynd/MYNDGallery.tsx` | Horizontal drag-scroll photo strip |
| Create | `src/components/mynd/MYNDSchedule.tsx` | Filterable timeline list of sub-events |
| Create | `src/app/meet-your-neighbor-day/page.tsx` | Server component page, SEO metadata |

---

## Task 1: Extend the Sanity Studio event schema

**Files:**
- Modify: `studio/schemaTypes/event.ts`

- [ ] **Step 1: Add three new fields to the event schema**

Replace the closing of the `fields` array (before `preview:`) with the following additions. The full file after editing:

```typescript
import {defineType, defineField} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'allDay',
      title: 'All Day Event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Community', value: 'community'},
          {title: 'Government', value: 'government'},
          {title: 'Recreation', value: 'recreation'},
          {title: 'Arts & Culture', value: 'arts-culture'},
          {title: 'Business', value: 'business'},
          {title: 'Holiday', value: 'holiday'},
          {title: 'Sports', value: 'sports'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location Name',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Full street address for map linking',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
    }),
    defineField({
      name: 'isFree',
      title: 'Free Event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'cost',
      title: 'Cost',
      type: 'string',
      description: 'e.g. "$10 per person" — leave blank if free',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration / More Info URL',
      type: 'url',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    // --- MYND / special event fields ---
    defineField({
      name: 'customUrl',
      title: 'Custom Landing Page URL',
      type: 'string',
      description: 'If set, the event card in the directory links here instead of /events/[slug]. e.g. /meet-your-neighbor-day',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      description: 'Photos shown in the horizontal scroll strip on the landing page.',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'subEvents',
      title: 'Sub-Events',
      type: 'array',
      description: 'Individual activities shown in the filterable schedule on the landing page.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
            defineField({
              name: 'startTime',
              title: 'Start Time',
              type: 'datetime',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'endTime',
              title: 'End Time',
              type: 'datetime',
            }),
            defineField({
              name: 'locationName',
              title: 'Location Name',
              type: 'string',
              description: 'e.g. "Community Park"',
            }),
            defineField({
              name: 'address',
              title: 'Address',
              type: 'string',
              description: 'Full address — used to create a Google Maps link',
            }),
            defineField({
              name: 'categories',
              title: 'Categories',
              type: 'array',
              description: 'e.g. games, food, music. Used for filter pills.',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'isFree',
              title: 'Free',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'startTime'},
            prepare({title, subtitle}) {
              return {
                title,
                subtitle: subtitle
                  ? new Date(subtitle).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                      timeZone: 'America/Chicago',
                    })
                  : '',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
    },
    prepare({title, date, media}) {
      return {
        title,
        subtitle: date
          ? new Date(date).toLocaleDateString('en-US', {dateStyle: 'medium'})
          : 'No date set',
        media,
      }
    },
  },
})
```

- [ ] **Step 2: Verify Sanity Studio still loads**

```bash
cd studio && npx sanity dev
```

Open `http://localhost:3333`, navigate to an event document, and confirm the three new fields appear at the bottom: "Custom Landing Page URL", "Gallery Images", "Sub-Events". Stop the Studio server (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add studio/schemaTypes/event.ts
git commit -m "feat(studio): add customUrl, galleryImages, subEvents to event schema"
```

---

## Task 2: Extend TypeScript types and add GROQ query

**Files:**
- Modify: `src/lib/sanity.ts`

- [ ] **Step 1: Add `SubEvent` interface and extend `SanityEvent`**

In `src/lib/sanity.ts`, add the `SubEvent` interface directly before the `SanityEvent` interface (around line 238), and add three new optional fields to `SanityEvent`:

```typescript
export interface SubEvent {
  _key: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  locationName?: string;
  address?: string;
  categories?: string[];
  isFree?: boolean;
}

export interface SanityEvent {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  endDate?: string;
  allDay?: boolean;
  location?: string;
  address?: string;
  description?: string;
  image?: {
    asset: { _id: string; url: string };
    alt?: string;
  };
  category?: string;
  featured?: boolean;
  registrationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  organizer?: string;
  isFree?: boolean;
  cost?: string;
  // Special landing page fields
  customUrl?: string;
  galleryImages?: Array<{ asset: { _id: string; url: string }; alt?: string }>;
  subEvents?: SubEvent[];
}
```

- [ ] **Step 2: Add `customUrl` to `EVENT_FIELDS` and add `getMYNDEvent()`**

Update the `EVENT_FIELDS` constant (around line 262) to include `customUrl`, then add `getMYNDEvent()` after `getEventsHighlights()`:

```typescript
const EVENT_FIELDS = `
  _id, title, slug, date, endDate, allDay, location, address, description,
  image { asset->{ _id, url }, alt },
  category, featured, registrationUrl, contactEmail, contactPhone, organizer, isFree, cost, customUrl
`;
```

Add after the closing brace of `getEventsHighlights()`:

```typescript
export async function getMYNDEvent(): Promise<SanityEvent | null> {
  return client.fetch(
    `*[_type == "event" && slug.current == "meet-your-neighbor-day"][0] {
      ${EVENT_FIELDS},
      galleryImages[] { asset->{ _id, url }, alt },
      subEvents[] {
        _key, title, description, startTime, endTime,
        locationName, address, categories, isFree
      }
    }`
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build completes with no TypeScript errors. (Next.js will report route info; ignore "page not found" for the new route since we haven't created it yet.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/sanity.ts
git commit -m "feat: add SubEvent type, extend SanityEvent, add getMYNDEvent query"
```

---

## Task 3: Patch EventCard to support `customUrl`

**Files:**
- Modify: `src/components/EventsDirectory.tsx`

- [ ] **Step 1: Update the `EventCard` Link href**

In `src/components/EventsDirectory.tsx`, find the `EventCard` component's wrapping `<Link>` (around line 42):

```tsx
// Before
<Link
  href={`/events/${event.slug.current}`}
  className="group block bg-bg-primary rounded-sm shadow-sm hover:shadow-lg transition-all duration-300"
>
```

Change to:

```tsx
// After
<Link
  href={event.customUrl ?? `/events/${event.slug.current}`}
  className="group block bg-bg-primary rounded-sm shadow-sm hover:shadow-lg transition-all duration-300"
>
```

- [ ] **Step 2: Start dev server and verify the events page still works**

```bash
npm run dev
```

Open `http://localhost:3000/events`. Confirm existing event cards still link to `/events/[slug]`. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/EventsDirectory.tsx
git commit -m "feat: use customUrl in EventCard when present"
```

---

## Task 4: Create MYNDHero component

**Files:**
- Create: `src/components/mynd/MYNDHero.tsx`

- [ ] **Step 1: Create the file**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mynd/MYNDHero.tsx
git commit -m "feat: add MYNDHero component"
```

---

## Task 5: Create MYNDGallery component

**Files:**
- Create: `src/components/mynd/MYNDGallery.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";

type GalleryImage = { asset: { _id: string; url: string }; alt?: string };

export function MYNDGallery({ images }: { images: GalleryImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  function onMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current);
  }

  function stopDrag() {
    dragging.current = false;
  }

  if (!images?.length) return null;

  return (
    <section className="py-10 bg-bg-secondary">
      <div className="container mx-auto px-4 mb-4">
        <h2 className="text-xl font-bold text-text-primary">Previous Years</h2>
      </div>
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto px-4 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none", height: 220 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {images.map((img, i) => (
          <div
            key={img.asset._id ?? i}
            className="relative flex-shrink-0 rounded-sm overflow-hidden"
            style={{ width: 320 }}
          >
            <Image
              src={img.asset.url}
              alt={img.alt || `Meet Your Neighbor Day photo ${i + 1}`}
              fill
              className="object-cover pointer-events-none"
              sizes="320px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mynd/MYNDGallery.tsx
git commit -m "feat: add MYNDGallery horizontal scroll strip component"
```

---

## Task 6: Create MYNDSchedule component

**Files:**
- Create: `src/components/mynd/MYNDSchedule.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useState, useMemo } from "react";
import { MapPin, Clock } from "lucide-react";
import { SubEvent } from "@/lib/sanity";

const TZ = "America/Chicago";

const BORDER_HEX = ["#2d6a4f", "#1a3a5c", "#8b6914", "#6a1a6a", "#8b1a1a"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
}

function getTimeOfDay(iso: string): "morning" | "afternoon" | "evening" {
  const hour = parseInt(
    new Date(iso).toLocaleString("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: TZ,
    })
  );
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function MYNDSchedule({ subEvents }: { subEvents: SubEvent[] }) {
  const [timeFilter, setTimeFilter] = useState<
    "all" | "morning" | "afternoon" | "evening"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [freeOnly, setFreeOnly] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    subEvents.forEach((e) => e.categories?.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [subEvents]);

  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat, i) => {
      map[cat] = BORDER_HEX[i % BORDER_HEX.length];
    });
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    return [...subEvents]
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .filter((e) => {
        if (
          timeFilter !== "all" &&
          getTimeOfDay(e.startTime) !== timeFilter
        )
          return false;
        if (
          categoryFilter !== "all" &&
          !e.categories?.includes(categoryFilter)
        )
          return false;
        if (freeOnly && !e.isFree) return false;
        return true;
      });
  }, [subEvents, timeFilter, categoryFilter, freeOnly]);

  function borderColorFor(e: SubEvent) {
    const firstCat = e.categories?.[0];
    return firstCat ? categoryColorMap[firstCat] : "var(--color-accent)";
  }

  const pillBase =
    "px-3 py-1.5 rounded-full text-sm font-semibold transition-colors";
  const pillActive = "bg-primary text-white";
  const pillInactive =
    "bg-bg-primary text-text-secondary hover:text-text-primary";

  return (
    <section id="schedule" className="py-12 bg-bg-secondary">
      <div className="container max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Schedule</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["all", "morning", "afternoon", "evening"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`${pillBase} ${timeFilter === t ? pillActive : pillInactive}`}
            >
              {t === "all"
                ? "All Day"
                : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setCategoryFilter(categoryFilter === cat ? "all" : cat)
              }
              className={`${pillBase} capitalize ${
                categoryFilter === cat
                  ? "bg-accent text-white"
                  : pillInactive
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`${pillBase} ${
              freeOnly ? "bg-green-600 text-white" : pillInactive
            }`}
          >
            Free only
          </button>
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <p className="text-center text-text-secondary py-10">
            No events match your filters.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((event) => (
              <div
                key={event._key}
                className="flex gap-4 items-start bg-bg-primary rounded-sm shadow-sm px-4 py-4 border-l-4"
                style={{ borderLeftColor: borderColorFor(event) }}
              >
                {/* Time */}
                <div className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-text-secondary min-w-[72px] pt-0.5">
                  <Clock size={11} className="opacity-60" />
                  {formatTime(event.startTime)}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-text-primary">
                      {event.title}
                    </span>
                    {event.isFree && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                        Free
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-xs text-text-secondary mb-1.5">
                      {event.description}
                    </p>
                  )}

                  {event.locationName && (
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <MapPin size={11} className="flex-shrink-0 opacity-60" />
                      {event.address ? (
                        <a
                          href={mapsUrl(event.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-text-hover transition-colors underline underline-offset-2"
                        >
                          {event.locationName}
                        </a>
                      ) : (
                        <span>{event.locationName}</span>
                      )}
                    </div>
                  )}

                  {event.categories && event.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] px-2 py-0.5 bg-bg-secondary text-text-secondary rounded-full capitalize"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* End time */}
                {event.endTime && (
                  <div className="flex-shrink-0 text-[10px] text-text-secondary pt-0.5 whitespace-nowrap">
                    ends {formatTime(event.endTime)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mynd/MYNDSchedule.tsx
git commit -m "feat: add MYNDSchedule filterable timeline component"
```

---

## Task 7: Create the landing page

**Files:**
- Create: `src/app/meet-your-neighbor-day/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import { getMYNDEvent } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/lib/seo";
import { domainUrl } from "@/lib/constants";
import { MYNDHero } from "@/components/mynd/MYNDHero";
import { MYNDGallery } from "@/components/mynd/MYNDGallery";
import { MYNDSchedule } from "@/components/mynd/MYNDSchedule";

export async function generateMetadata() {
  const event = await getMYNDEvent();
  if (!event) return {};
  return generateSEOMetadata({
    title: `${event.title} – Argyle, MN`,
    description:
      event.description?.slice(0, 155) ||
      "Meet Your Neighbor Day — a week of community events in Argyle, Minnesota.",
    canonicalUrl: `${domainUrl}/meet-your-neighbor-day`,
    ogImage: event.image?.asset?.url || `${domainUrl}/argyle-drone.jpg`,
  });
}

export default async function MeetYourNeighborDayPage() {
  const event = await getMYNDEvent();
  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-bg-secondary">
      <MYNDHero event={event} />
      {event.galleryImages && event.galleryImages.length > 0 && (
        <MYNDGallery images={event.galleryImages} />
      )}
      {event.subEvents && event.subEvents.length > 0 && (
        <MYNDSchedule subEvents={event.subEvents} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Start dev server and verify the page loads**

```bash
npm run dev
```

Open `http://localhost:3000/meet-your-neighbor-day`.

Expected at this point (before adding Sanity data): the page returns a 404 because no `meet-your-neighbor-day` event exists in Sanity yet — that's correct behaviour given `notFound()`.

- [ ] **Step 3: Create the MYND event in Sanity Studio**

```bash
cd studio && npx sanity dev
```

In Sanity Studio at `http://localhost:3333`:
1. Create a new **Event** document
2. Set **Title** to `Meet Your Neighbor Day`
3. Set **Slug** to `meet-your-neighbor-day` (use the "Generate" button)
4. Set **Date** and **End Date** to the event's week dates
5. Set **Custom Landing Page URL** to `/meet-your-neighbor-day`
6. Add a few placeholder **Sub-Events** with `startTime`, `locationName`, and `categories` to test the schedule
7. Publish the document

- [ ] **Step 4: Verify the full page in the browser**

Return to `http://localhost:3000/meet-your-neighbor-day` (restart the Next.js dev server if needed).

Confirm:
- Hero renders with event title and date range
- "See the Schedule ↓" scrolls to the schedule section
- Sub-events appear in the timeline in chronological order
- Pill filters (time of day, categories, free only) show and filter correctly
- Location names with an address are clickable links that open Google Maps in a new tab
- Events page at `http://localhost:3000/events` shows the MYND event card, and clicking it navigates to `/meet-your-neighbor-day`

- [ ] **Step 5: Run the production build to catch any type errors**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/meet-your-neighbor-day/page.tsx
git commit -m "feat: add Meet Your Neighbor Day landing page"
```
