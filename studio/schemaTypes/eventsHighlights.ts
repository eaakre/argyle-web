import {defineType, defineField} from 'sanity'

export const eventsHighlights = defineType({
  name: 'eventsHighlights',
  type: 'object',
  title: 'Events Highlights',
  fields: [
    defineField({
      name: 'sectionTitle',
      type: 'string',
      title: 'Section Title (optional)',
      description: 'Overrides the default "Upcoming Events" heading. Leave blank to use the default.',
    }),
    defineField({
      name: 'image',
      title: 'Section Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Upcoming Events'}
    },
  },
})
