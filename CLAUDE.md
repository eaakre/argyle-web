# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build with Turbopack
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured.

## Architecture

This is a Next.js 15 App Router site for Argyle, Minnesota (a municipal/city website). Content is managed entirely through **Sanity CMS** — almost every page is driven by CMS data fetched at render time.

### Content-Slot Pattern

Pages in Sanity contain a `contentSlots` array — a list of typed blocks (hero, gallery, textBlock, municipalGroup, quickLinksGrid, businessSection, etc.). The `ContentSlotRenderer` component acts as a dispatch layer, rendering the appropriate block component for each entry. This is the core rendering model; when adding new content types, you add both a Sanity schema type and a corresponding renderer here.

### Data Flow

- `src/lib/` contains all Sanity GROQ queries (e.g. `getPageBySlug`, `getAllBusinesses`, `getAnnouncements`).
- Pages are server components that call these query functions directly.
- The root layout (`src/app/layout.tsx`) fetches announcements from Sanity and passes them to the `AnnouncementBar` inside the `Header`.

### Dynamic Routes

- `src/app/[slug]/page.tsx` — catch-all for CMS-driven pages; calls `getPageBySlug(slug)` and uses `ContentSlotRenderer`.
- `src/app/business/[slug]/page.tsx` — individual business detail pages.
- `src/app/city-services/[slug]/page.tsx` — individual city service pages.

### API Routes

- `src/app/api/contact/route.ts` — POST handler for the contact form; validates fields and sends email via **Resend**.

### Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=dtn82a1i
NEXT_PUBLIC_SANITY_DATASET=production
RESEND_API_KEY=
RESEND_FROM=
RESEND_TO=
```

### Key Conventions

- Path alias `@/*` maps to `src/*`.
- Styling: Tailwind CSS v4 with `class-variance-authority` (CVA) for component variants.
- Images from Sanity CDN (`cdn.sanity.io`) are configured as a trusted remote in `next.config.ts`.
- `generateMetadata()` is used on every page for SEO; shared logic lives in `src/lib/seo.ts`.
- `Header` is a client component (`"use client"`) due to scroll-based hide/show behavior and mobile drawer.
