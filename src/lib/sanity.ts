// lib/sanity.ts
import { createClient, groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImage } from "@/types/cms";

// Constants for reuse
export const projectId = "dtn82a1i";
export const dataset = "production";

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

export async function getAllBusinesses(): Promise<Business[]> {
  const query = `
    *[_type == "business"] | order(name asc) {
      _id,
      name,
      slug,
      address,
      phone,
      website,
      email,
      description,
      category,
      logo,
      hours,
      featured
    }
  `;

  return await client.fetch(query);
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
  const query = `
    *[_type == "business" && featured == true] | order(name asc) {
      _id,
      name,
      slug,
      address,
      phone,
      website,
      email,
      description,
      category,
      logo,
      hours,
      featured
    }
  `;

  return await client.fetch(query);
}

export async function getBusinessesByCategory(
  category: string
): Promise<Business[]> {
  const query = `
    *[_type == "business" && category == $category] | order(name asc) {
      _id,
      name,
      slug,
      address,
      phone,
      website,
      email,
      description,
      category,
      logo,
      hours,
      featured
    }
  `;

  return await client.fetch(query, { category });
}

export async function getBusinessBySlug(
  slug: string
): Promise<Business | null> {
  const query = `
    *[_type == "business" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      address,
      phone,
      website,
      email,
      description,
      category,
      logo,
      hours,
      featured
    }
  `;

  return await client.fetch(query, { slug });
}
