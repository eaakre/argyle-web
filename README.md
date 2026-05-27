# Argyle, MN — City Website

The official website for Argyle, Minnesota. Built with Next.js 15 (App Router) and Sanity CMS.

## Tech Stack

- **Framework:** Next.js 15 with Turbopack
- **CMS:** Sanity
- **Styling:** Tailwind CSS v4 with `class-variance-authority`

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in the required variables (see Environment Variables below).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

## Architecture

Content is managed entirely through Sanity. Pages contain a `contentSlots` array — typed blocks (hero, gallery, textBlock, etc.) dispatched by `ContentSlotRenderer`. To add a new content type, add a Sanity schema and a case in `ContentSlotRenderer`.

GROQ queries live in `src/lib/`. Pages are server components that call these directly.

### Key Routes

- `src/app/[slug]/page.tsx` — CMS-driven pages
- `src/app/business/[slug]/page.tsx` — Business detail pages
- `src/app/city-services/[slug]/page.tsx` — City service pages
- `src/app/api/contact/route.ts` — Contact form (POST)

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
```
