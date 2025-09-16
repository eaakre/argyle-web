// lib/sanity.ts
import { createClient, groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
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

// Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-01",
  useCdn: true,
});

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
  return await client.fetch(query);
}

export async function getAllPages() {
  return await client.fetch(`*[_type == "page"]{ slug }`);
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
        ...
      }
    }`;
  return await client.fetch(query, { slug });
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

  return client.fetch(query);
}

export async function getBusinessBySlug(slug: string) {
  return client.fetch(
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

  return client.fetch(query);
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

  return client.fetch(query, { category });
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
    slug,
  }`;

  if (limit) {
    query += `[0...${limit}]`;
  }

  return client.fetch(query, { isActive });
}
