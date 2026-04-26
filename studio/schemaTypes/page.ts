import {defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Meta Description',
      description: 'Used for SEO and social sharing previews',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      title: 'Keywords (optional)',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'socialImage',
      type: 'image',
      title: 'Social Sharing Image (1200x630)',
      options: {hotspot: true},
    }),
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Page H1 (for SEO and accessibility)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentSlots',
      type: 'array',
      title: 'Content Slots',
      of: [
        {type: 'hero'},
        {type: 'textBlock'},
        {type: 'quickLinksGrid'},
        {type: 'gallery'},
        {type: 'municipalGroup'},
        {type: 'googleMap'},
      ],
    }),
  ],
})
