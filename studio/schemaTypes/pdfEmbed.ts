import {defineField, defineType} from 'sanity'

export const pdfEmbed = defineType({
  name: 'pdfEmbed',
  type: 'object',
  title: 'PDF Embed',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Optional label shown above the PDF viewer',
    }),
    defineField({
      name: 'file',
      type: 'file',
      title: 'PDF File',
      options: {accept: '.pdf'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'height',
      type: 'number',
      title: 'Viewer Height (px)',
      description: 'Height of the embedded PDF viewer in pixels',
      initialValue: 800,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'PDF Embed'}
    },
  },
})
