import {defineType, defineField} from 'sanity'

export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'News Article',
  type: 'document',
  orderings: [
    {
      title: 'Date, Newest First',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'council-minutes',
      options: {
        list: [
          {title: 'City Council Minutes', value: 'council-minutes'},
          {title: 'Public Notice', value: 'public-notice'},
          {title: 'General News', value: 'general-news'},
          {title: 'Announcement', value: 'announcement'},
        ],
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on the news listing page for non-featured articles.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
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
      ],
    }),
    defineField({
      name: 'pdfAttachment',
      title: 'PDF Attachment',
      type: 'file',
      options: {accept: '.pdf'},
      description: 'Optional PDF document (e.g. official meeting minutes)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      category: 'category',
    },
    prepare({title, date, category}) {
      const categoryLabels: Record<string, string> = {
        'council-minutes': 'Council Minutes',
        'public-notice': 'Public Notice',
        'general-news': 'General News',
        'announcement': 'Announcement',
      }
      return {
        title,
        subtitle: [
          date ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', {dateStyle: 'medium'}) : '',
          category ? categoryLabels[category] : '',
        ]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
