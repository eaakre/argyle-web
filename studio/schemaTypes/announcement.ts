import {defineType, defineField} from 'sanity'

export const announcement = defineType({
  name: 'announcement',
  type: 'document',
  title: 'Announcement',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Announcement Text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Active',
      description: 'Toggle to show/hide this announcement',
      initialValue: false,
    }),
    defineField({
      name: 'startDate',
      type: 'datetime',
      title: 'Start Date',
      description: 'When this announcement should begin showing',
    }),
    defineField({
      name: 'endDate',
      type: 'datetime',
      title: 'End Date',
      description: 'When this announcement should stop showing (optional)',
    }),
    defineField({
      name: 'link',
      type: 'string',
      title: 'Link URL',
      description: 'Optional link for more information. Use a full URL (https://...) for external links or a relative path (/page-slug) for internal pages.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          if (value.startsWith('/')) return true
          try {
            new URL(value)
            return true
          } catch {
            return 'Enter a valid URL (https://...) or a relative path starting with /'
          }
        }),
    }),
    defineField({
      name: 'linkText',
      type: 'string',
      title: 'Link Text',
      description: 'Text for the link (defaults to "Learn more")',
      hidden: ({document}) => !document?.link,
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Icon',
      options: {
        list: [
          {title: 'Info', value: 'info'},
          {title: 'Alert', value: 'alert'},
          {title: 'Calendar', value: 'calendar'},
          {title: 'Construction', value: 'construction'},
          {title: 'Emergency', value: 'emergency'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      startDate: 'startDate',
    },
    prepare({title, isActive, startDate}) {
      const status = isActive ? '🟢' : '🔴'
      const date = startDate ? new Date(startDate).toLocaleDateString() : ''

      return {
        title: title || 'Untitled Announcement',
        subtitle: `${status} ${isActive ? 'Active' : 'Inactive'} ${date ? `• ${date}` : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Start Date, New',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
    {
      title: 'Active Status',
      name: 'activeFirst',
      by: [
        {field: 'isActive', direction: 'desc'},
        {field: 'startDate', direction: 'desc'},
      ],
    },
  ],
})
