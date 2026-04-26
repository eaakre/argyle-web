import {defineField, defineType} from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  type: 'object',
  title: 'Text Block Section',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      description: 'Main heading for the text block',
    }),
    defineField({
      name: 'subheading',
      type: 'string',
      title: 'Subheading',
      description: 'Optional subheading above the main heading',
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'backgroundType',
      type: 'string',
      title: 'Background Type',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Image', value: 'image'},
          {title: 'Color', value: 'color'},
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
      hidden: ({parent}) => parent?.backgroundType !== 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'backgroundColor',
      type: 'string',
      title: 'Background Color (Hex or Tailwind class)',
      description: 'Example: #f1f1f1 or bg-gray-100',
      hidden: ({parent}) => parent?.backgroundType !== 'color',
    }),
    defineField({
      name: 'layout',
      type: 'string',
      title: 'Layout Style',
      options: {
        list: [
          {title: 'Single Column', value: 'single'},
          {title: 'Two Columns', value: 'two-column'},
          {title: 'Sidebar Left', value: 'sidebar-left'},
          {title: 'Sidebar Right', value: 'sidebar-right'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'single',
    }),
    defineField({
      name: 'align',
      type: 'string',
      title: 'Text Alignment',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'maxWidth',
      type: 'string',
      title: 'Maximum Width',
      options: {
        list: [
          {title: 'Small (640px)', value: 'max-w-2xl'},
          {title: 'Medium (768px)', value: 'max-w-4xl'},
          {title: 'Large (1024px)', value: 'max-w-6xl'},
          {title: 'Extra Large (1280px)', value: 'max-w-7xl'},
          {title: 'Full Width', value: 'max-w-none'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'max-w-4xl',
    }),
    defineField({
      name: 'padding',
      type: 'string',
      title: 'Section Padding',
      options: {
        list: [
          {title: 'None', value: 'py-0'},
          {title: 'Small', value: 'py-2'},
          {title: 'Medium', value: 'py-4'},
          {title: 'Large', value: 'py-6'},
          {title: 'Extra Large', value: 'py-8'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'py-0',
    }),
    defineField({
      name: 'ctas',
      type: 'array',
      of: [{type: 'cta'}],
      title: 'Call to Actions',
      description: 'Optional buttons or links',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'subheading',
      media: 'backgroundImage',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title || 'Text Block',
        subtitle: subtitle || 'Rich text content section',
        media: media,
      }
    },
  },
})
