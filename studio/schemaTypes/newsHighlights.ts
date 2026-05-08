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
  ],
  preview: {
    prepare() {
      return {title: 'News & Announcements'}
    },
  },
})
