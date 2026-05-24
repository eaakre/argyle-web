import {defineType, defineField, defineArrayMember} from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  type: 'document',
  title: 'Navigation',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'navLinks',
      type: 'array',
      title: 'Navigation Links',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navLink',
          title: 'Link',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required()}),
            defineField({name: 'href', type: 'string', title: 'URL', description: 'Leave blank if this item only has children'}),
            defineField({
              name: 'children',
              type: 'array',
              title: 'Dropdown Items',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required()}),
                    defineField({name: 'href', type: 'string', title: 'URL', validation: (Rule) => Rule.required()}),
                  ],
                  preview: {select: {title: 'label', subtitle: 'href'}},
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
            prepare({title, subtitle}) {
              return {title, subtitle: subtitle || '(dropdown)'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navigation'}
    },
  },
})
