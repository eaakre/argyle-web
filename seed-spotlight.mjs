/**
 * One-off script: adds a featureSpotlight mock entry to the Homepage contentSlots.
 *
 * Prerequisites:
 *   1. Add SANITY_TOKEN=<your-write-token> to .env.local
 *      (Sanity Studio → manage.sanity.io → project → API → Tokens → add Editor token)
 *   2. Run from the project root:  node seed-spotlight.mjs
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: "2024-06-01",
  useCdn: false,
});

const spotlight = {
  _type: "featureSpotlight",
  _key: "the-suites-spotlight",
  title: "The Suites",
  tagline: "now leasing",
  description:
    "Looking for the perfect place to start or expand your business? A fresh, modern space that blends clean design with limitless opportunity. " +
    "3 commercial units available at 115 E 5th Street — prime location on HWY 75, central to Grand Forks, Thief River Falls, Crookston, and Grafton. " +
    "Each unit includes a private bathroom, utilities, back entrance, optimal customer parking, and front patio space. " +
    "Reduced payments for the first two years, with contract for deed style financing available through the city of Argyle's economic development program.",
  // Images must be added via Sanity Studio after running this script.
  // Open the Homepage document, find this slot, and upload your photos.
  images: [],
  ctas: [
    {
      _key: "cta-call",
      _type: "cta",
      text: "Call Us",
      href: "tel:+12184376621",
      variant: "default",
      size: "default",
    },
    {
      _key: "cta-email",
      _type: "cta",
      text: "Email Us",
      href: "mailto:argyle@wiktel.com",
      variant: "outline",
      size: "default",
    },
  ],
};

const homepage = await client.fetch(
  `*[_type == "page" && slug.current == "Homepage"][0]{ _id }`
);

if (!homepage) {
  console.error("Homepage document not found in Sanity.");
  process.exit(1);
}

await client.patch(homepage._id).append("contentSlots", [spotlight]).commit();

console.log("Done — featureSpotlight added to Homepage.");
console.log("Next: open Sanity Studio, find the Homepage, and upload images to the slot.");
