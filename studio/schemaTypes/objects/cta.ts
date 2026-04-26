import { defineType, defineField } from "sanity";

export const cta = defineType({
  name: "cta",
  type: "object",
  title: "Call to Action",
  fields: [
    defineField({
      name: "text",
      type: "string",
      title: "Text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      type: "string", // allows relative or absolute
      title: "Link (href)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      type: "string",
      title: "Variant",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Destructive", value: "destructive" },
          { title: "Outline", value: "outline" },
          { title: "Secondary", value: "secondary" },
          { title: "Ghost", value: "ghost" },
          { title: "Link", value: "link" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "size",
      type: "string",
      title: "Size",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Small", value: "sm" },
          { title: "Large", value: "lg" },
          { title: "Icon", value: "icon" },
        ],
        layout: "dropdown",
      },
    }),
  ],
});
