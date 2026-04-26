import {defineField, defineType} from 'sanity'

export const quickLinksGrid = defineType({
  name: 'quickLinksGrid',
  type: 'object',
  title: 'Quick Links Grid',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Section Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 2,
    }),
    defineField({
      name: 'links',
      type: 'array',
      title: 'Quick Links',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Title'},
            {name: 'description', type: 'text', title: 'Description'},
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              description: 'Takes precedence over emoji icon if both are set',
              options: {hotspot: true},
              fields: [{name: 'alt', type: 'string', title: 'Alt Text'}],
            },
            {name: 'icon', type: 'string', title: 'Icon (emoji fallback)'},
            {name: 'url', type: 'string', title: 'URL'},
            {name: 'isExternal', type: 'boolean', title: 'External Link'},
          ],
        },
      ],
    }),
    defineField({
      name: 'columns',
      type: 'number',
      title: 'Columns (2-4)',
      validation: (Rule) => Rule.min(2).max(4),
      initialValue: 3,
    }),
  ],
})
