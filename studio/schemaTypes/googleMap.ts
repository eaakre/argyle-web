import { defineField, defineType } from "sanity";

export const googleMap = defineType({
  name: "googleMap",
  type: "object",
  title: "Google Map Embed",
  fields: [
    defineField({
      name: "address",
      type: "string",
      title: "Address",
      description: "The address or location to embed on the map",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "height",
      type: "number",
      title: "Map Height (px)",
      initialValue: 600,
      validation: (Rule) => Rule.min(100).max(1000),
    }),
  ],
  preview: {
    select: {
      title: "address",
    },
    prepare(selection) {
      return {
        title: "Google Map: " + selection.title,
      };
    },
  },
});
