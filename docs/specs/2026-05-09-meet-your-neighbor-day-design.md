# Meet Your Neighbor Day — Landing Page Design

**Date:** 2026-05-09  
**Status:** Approved

---

## Overview

A dedicated, interactive landing page at `/meet-your-neighbor-day` for Argyle's annual Meet Your Neighbor Day (MYND) — a week-long series of community events with one main day that concentrates most activities. The page surfaces a filterable schedule, a Google Maps view of activity locations across town, and a photo gallery from previous years.

MYND also appears as a standard entry in the `/events` directory, with its event card linking to `/meet-your-neighbor-day` instead of the generic event detail page.

---

## Sanity Data Model

All MYND data lives in a single Sanity `event` document with slug `meet-your-neighbor-day`. Three new optional fields extend the existing `event` schema:

### `customUrl` (string, optional)
When present on any event, the event card in the events directory links to this URL instead of `/events/[slug]`. For MYND, set to `/meet-your-neighbor-day`. This field is reusable for any future "special" event that has its own landing page.

### `galleryImages[]` (array of image objects, optional)
Each entry has:
- `asset` — Sanity image reference
- `alt` — string, required for accessibility

Uploaded directly in Sanity Studio. Used to populate the photo gallery section.

### `subEvents[]` (array of embedded objects, optional)
Each sub-event has:

| Field | Type | Notes |
|---|---|---|
| `title` | string | Required |
| `description` | text | Optional |
| `startTime` | datetime | Required |
| `endTime` | datetime | Optional |
| `locationName` | string | e.g. "Community Park" |
| `address` | string | Full address for Google Maps geocoding |
| `lat` | number | Latitude for map pin |
| `lng` | number | Longitude for map pin |
| `categories` | string[] | Free-text strings set by CMS editor, e.g. `["games", "food", "music"]`. Filter pills are generated dynamically from whatever values exist in the data — no fixed vocabulary enforced. |
| `isFree` | boolean | Drives "Free only" filter |

Sub-events have no slugs and no standalone pages — they are purely display data within the MYND landing page.

---

## Page Route

`src/app/meet-your-neighbor-day/page.tsx` — server component that fetches the MYND event by slug and passes data to client components. Uses `generateMetadata()` for SEO following the existing pattern in `src/lib/seo.ts`.

A new GROQ query `getMYNDEvent()` in `src/lib/sanity.ts` fetches the event and projects `galleryImages` and `subEvents` in addition to all standard event fields. TypeScript types for the new fields are added to the `SanityEvent` interface.

---

## Page Sections

### 1. Hero
Full-width section with the event's hero image (from the existing `image` field), overlaid with:
- Event name
- Date range (e.g. "July 12–19, 2026")
- Short description
- Two CTA buttons: "See the Schedule" (anchor scroll to `#schedule`) and "View Map" (anchor scroll to `#map`)

Follows the visual style of the existing event detail hero in `src/app/events/[slug]/page.tsx`.

### 2. Photo Gallery
Horizontal scroll strip of `galleryImages` from Sanity. Client component (`MYNDGallery.tsx`) with mouse drag scroll on desktop and native touch scroll on mobile. Fixed height (~220px), images fill the strip with `object-cover`. No lightbox — the strip is the full gallery experience.

### 3. Schedule + Map (side by side)

The main interactive section, anchored at `#schedule` and `#map`. On desktop: schedule on the left (~55% width), map on the right (~45%). On mobile: schedule stacks above the map, map is passive (all pins visible, no click interaction).

#### Schedule (`MYNDSchedule.tsx`)
Client component. Displays sub-events in chronological order as a timeline list:
- Each row: time on the left, title + location + free badge on the right, colored left-border by category
- Pill filters above the list: time of day (Morning / Afternoon / Evening), category pills (one per unique category in the data), and a "Free only" toggle
- Filtering is client-side, instant, no network requests
- Active sub-event (set by map pin click) gets a highlighted background with smooth transition

Time-of-day buckets:
- Morning: before 12:00 PM
- Afternoon: 12:00 PM – 5:00 PM
- Evening: after 5:00 PM

#### Map (`MYNDMap.tsx`)
Client component using the **Google Maps JavaScript API** (not the existing iframe embed in `google-map.tsx`, which does not support interactive pins). Requires a `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable. One pin per sub-event; pin click sets `activeSubEvent` state, which scrolls the schedule to that row and highlights it.

Shared state: `activeSubEvent` (sub-event ID or null) lives in the parent page component and is passed as props to both `MYNDSchedule` and `MYNDMap`. Clicking a schedule row on desktop pans the map to that pin.

---

## EventCard Change

`EventCard` in `src/components/EventsDirectory.tsx` is updated to check for `event.customUrl`. When present, the wrapping `<Link>` uses `customUrl` as its `href` instead of `/events/${event.slug.current}`. No other behavior changes.

---

## File Structure

```
src/
  app/
    meet-your-neighbor-day/
      page.tsx                  # server component, fetches MYND event
  components/
    mynd/
      MYNDHero.tsx
      MYNDGallery.tsx           # "use client" — horizontal scroll strip
      MYNDSchedule.tsx          # "use client" — filterable timeline
      MYNDMap.tsx               # "use client" — Google Maps with pins
  lib/
    sanity.ts                   # getMYNDEvent() query + updated SanityEvent type
```

---

## Out of Scope

- Individual sub-event detail pages or slugs
- RSVP / "I'm going" functionality
- Countdown timer
- Community submission / story form
- Photo lightbox
- Map ↔ schedule interaction on mobile (map is passive on small screens)
