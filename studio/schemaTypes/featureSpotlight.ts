import { defineField, defineType } from "sanity";

export const featureSpotlight = defineType({
  name: "featureSpotlight",
  type: "object",
  title: "Feature Spotlight",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      title: "Tagline",
      description: "Short italic line displayed above the title (e.g. \"now leasing\")",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      rows: 4,
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Images",
      description: "First image is the hero. Remaining images appear as thumbnails.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "ctas",
      type: "array",
      title: "Call to Actions",
      description: "Supports regular URLs, mailto:, and tel: links.",
      of: [{ type: "cta" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tagline",
      media: "images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Feature Spotlight",
        subtitle: subtitle,
        media,
      };
    },
  },
});
