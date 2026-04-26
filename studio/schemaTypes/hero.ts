import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  type: "object",
  title: "Hero Section",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
    }),
    defineField({
      name: "subheading",
      type: "text",
      title: "Subheading",
      rows: 3,
    }),
    defineField({
      name: "backgroundType",
      type: "string",
      title: "Background Type",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
          { title: "Color", value: "color" },
        ],
        layout: "radio",
      },
      initialValue: "image",
    }),
    defineField({
      name: "backgroundImage",
      type: "image",
      title: "Background Image",
      hidden: ({ parent }) => parent?.backgroundType !== "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "backgroundVideoUrl",
      type: "url",
      title: "Background Video URL",
      hidden: ({ parent }) => parent?.backgroundType !== "video",
    }),
    defineField({
      name: "backgroundColor",
      type: "string",
      title: "Background Color (Hex or Tailwind class)",
      description: "Example: #1a1a1a or bg-gray-900",
      hidden: ({ parent }) => parent?.backgroundType !== "color",
    }),
    defineField({
      name: "fullWidth",
      type: "boolean",
      title: "Full Width",
    }),
    defineField({
      name: "ctas",
      type: "array",
      of: [{ type: "cta" }],
      title: "Call to Actions",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "subheading",
      media: "backgroundImage",
    },
  },
});
