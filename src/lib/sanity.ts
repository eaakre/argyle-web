// lib/sanity.ts
import { createClient, groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/types";
import { SanityImage } from "@/types/cms";

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID in environment variables"
  );
}
if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_DATASET in environment variables"
  );
}

// Constants for reuse
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Sanity client — useCdn: false so Next.js cache tags are the sole caching layer
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-01",
  useCdn: false,
});

// Wrapper that tags every fetch with 'sanity' so revalidateTag('sanity')
// busts all Sanity data at once when the Sanity webhook fires.
// The live fetch wrapper (defineLive) lives in src/lib/live.ts to keep
// this file importable by client components (for types and urlForImage).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sanityFetch<T = any>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  let isDraftMode = false;
  try {
    const { draftMode } = await import("next/headers");
    isDraftMode = (await draftMode()).isEnabled;
  } catch {
    // Called outside a request scope (e.g. generateStaticParams); use plain fetch
    return client.fetch<T>(query, params, { next: { tags: ["sanity"] } });
  }
  if (isDraftMode) {
    const { liveFetch } = await import("@/lib/live");
    const { data } = await liveFetch({ query, params });
    return data as T;
  }
  return client.fetch<T>(query, params, { next: { tags: ["sanity"] } });
}

// ✅ Image URL builder
const builder = imageUrlBuilder({ projectId, dataset });
export const urlForImage = (source: SanityImage) => builder.image(source);

// Get homepage (if still using it directly)
export async function getHomepageContent() {
  const query = groq`*[_type == "homepage"][0]{
    title,
    contentSlots[]{
      _type,
      ...
    }
  }`;
  return await sanityFetch(query);
}

export async function getAllPages() {
  return await sanityFetch(`*[_type == "page"]{ slug, pathPrefix }`);
}

// Get a flexible page by slug (preferred long-term)
export async function getPageBySlug(slug: string) {
  const query = groq`
    *[_type == "page" && slug.current == $slug][0]{
      title,
      slug,
      heading,
      contentSlots[]{
        _type,
        ...,
        image { asset->{ url }, alt },
        images[]{
          _type,
          _key,
          alt,
          caption,
          url,
          hotspot,
          crop,
          asset,
          image { asset, alt }
        }
      }
    }`;
  return await sanityFetch(query, { slug });
}

export interface Business {
  _id: string;
  name: string;
  slug: { current: string };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  phone?: string;
  website?: string;
  email?: string;
  description?: string;
  category?: string;
  logo?: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  featured?: boolean;
}

// Add these functions to your existing lib/sanity.ts file

export async function getAllBusinesses(options?: {
  orderBy?: "nameAsc" | "featuredFirst";
  category?: string;
  limit?: number;
}) {
  const { orderBy = "nameAsc", category, limit } = options || {};

  let query = `*[_type == "business"`;

  // Add category filter if provided
  if (category) {
    query += ` && category == "${category}"`;
  }

  query += `] {
    _id,
    name,
    slug,
    address,
    phone,
    website,
    email,
    description,
    category,
    logo {
      asset->{
        _id,
        url
      },
      alt
    },
    hours,
    featured
  }`;

  // Add ordering
  if (orderBy === "featuredFirst") {
    query += ` | order(featured desc, name asc)`;
  } else {
    query += ` | order(name asc)`;
  }

  // Add limit if provided
  if (limit) {
    query += `[0...${limit}]`;
  }

  return sanityFetch(query);
}

export async function getBusinessBySlug(slug: string) {
  return sanityFetch(
    `*[_type == "business" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      address,
      phone,
      website,
      email,
      description,
      category,
      logo {
        asset->{
          _id,
          url
        },
        alt
      },
      hours,
      featured
    }`,
    { slug }
  );
}

export async function getFeaturedBusinesses(limit?: number) {
  let query = `*[_type == "business" && featured == true] {
    _id,
    name,
    slug,
    address,
    phone,
    website,
    email,
    description,
    category,
    logo {
      asset->{
        _id,
        url
      },
      alt
    },
    hours,
    featured
  } | order(name asc)`;

  if (limit) {
    query += `[0...${limit}]`;
  }

  return sanityFetch(query);
}

export async function getBusinessesByCategory(
  category: string,
  limit?: number
) {
  let query = `*[_type == "business" && category == $category] {
    _id,
    name,
    slug,
    address,
    phone,
    website,
    email,
    description,
    category,
    logo {
      asset->{
        _id,
        url
      },
      alt
    },
    hours,
    featured
  } | order(featured desc, name asc)`;

  if (limit) {
    query += `[0...${limit}]`;
  }

  return sanityFetch(query, { category });
}

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
  registrationText?: string;
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

const EVENT_FIELDS = `
  _id, title, slug, date, endDate, allDay, location, address, description,
  image { asset->{ _id, url }, alt },
  category, featured, registrationUrl, registrationText, contactEmail, contactPhone, organizer, isFree, cost, customUrl,
  galleryImages[] { asset->{ _id, url }, alt }
`;

export async function getAllEvents(): Promise<SanityEvent[]> {
  return sanityFetch(
    `*[_type == "event"] { ${EVENT_FIELDS} } | order(date asc)`
  );
}

export async function getEventBySlug(slug: string): Promise<SanityEvent | null> {
  return sanityFetch(
    `*[_type == "event" && slug.current == $slug][0] { ${EVENT_FIELDS} }`,
    { slug }
  );
}

export async function getUpcomingEvents(limit?: number): Promise<SanityEvent[]> {
  const now = new Date().toISOString();
  const base = `*[_type == "event" && date >= $now] { ${EVENT_FIELDS} } | order(date asc)`;
  const query = limit ? `(${base})[0...${limit}]` : base;
  return sanityFetch(query, { now });
}

export async function getEventsHighlights(): Promise<{
  upcoming: SanityEvent[];
}> {
  const now = new Date().toISOString();
  const upcoming = await sanityFetch<SanityEvent[]>(
    `*[_type == "event" && date >= $now] | order(date asc)[0...3] { ${EVENT_FIELDS} }`,
    { now }
  );
  return { upcoming: upcoming ?? [] };
}

export async function getMYNDEvent(): Promise<SanityEvent | null> {
  return sanityFetch(
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

export interface SanityNewsArticle {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  category?: string;
  excerpt?: string;
  pinned?: boolean;
  body?: PortableTextBlock[];
  pdfAttachment?: { asset: { url: string } };
}

const NEWS_FIELDS = `
  _id, title, slug, date, category, excerpt,
  pdfAttachment { asset->{ url } }
`;

export async function getAllNewsArticles(): Promise<SanityNewsArticle[]> {
  return sanityFetch(
    `*[_type == "newsArticle"] { ${NEWS_FIELDS} } | order(date desc)`
  );
}

export async function getNewsHighlights(): Promise<SanityNewsArticle[]> {
  return sanityFetch(
    `*[_type == "newsArticle"] | order(coalesce(pinned, false) desc, date desc)[0...3] {
      _id, title, slug, date, category, excerpt, pinned
    }`
  );
}

export async function getNewsArticleBySlug(slug: string): Promise<SanityNewsArticle | null> {
  return sanityFetch(
    `*[_type == "newsArticle" && slug.current == $slug][0] { ${NEWS_FIELDS}, body }`,
    { slug }
  );
}

export async function getAllNewsArticleSlugs(): Promise<{ slug: { current: string } }[]> {
  return sanityFetch(`*[_type == "newsArticle"]{ slug }`);
}

export interface SanityNavChild {
  _key: string;
  label: string;
  href: string;
}

export interface SanityNavLink {
  _key: string;
  label: string;
  href?: string;
  children?: SanityNavChild[];
}

export async function getNavLinks(): Promise<SanityNavLink[]> {
  const result = await sanityFetch<{ navLinks: SanityNavLink[] } | null>(
    `*[_type == "navigation" && _id == "navigation"][0]{ navLinks }`
  );
  return result?.navLinks ?? [];
}

export async function getAnnouncements(isActive: boolean, limit?: number) {
  let query = `*[_type == "announcement" && isActive == $isActive] {
    _id,
    title,
    isActive,
    startDate,
    endDate,
    link,
    linkText,
    icon,
  }`;

  if (limit) {
    query += `[0...${limit}]`;
  }

  return sanityFetch(query, { isActive });
}
