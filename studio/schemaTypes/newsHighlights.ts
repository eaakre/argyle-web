import {defineType, defineField} from 'sanity'

export const newsHighlights = defineType({
  name: 'newsHighlights',
  type: 'object',
  title: 'News Highlights',
  fields: [
    defineField({
      name: 'sectionTitle',
      type: 'string',
      title: 'Section Title (optional)',
      description: 'Overrides the default "News & Announcements" heading. Leave blank to use the default.',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Background Image',
      description: 'Displayed full-bleed on the left side (desktop) or above the carousel (mobile).',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'News & Announcements'}
    },
  },
})
