import {defineType, defineField} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
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
      title: 'Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'allDay',
      title: 'All Day Event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Community', value: 'community'},
          {title: 'Government', value: 'government'},
          {title: 'Recreation', value: 'recreation'},
          {title: 'Arts & Culture', value: 'arts-culture'},
          {title: 'Business', value: 'business'},
          {title: 'Holiday', value: 'holiday'},
          {title: 'Sports', value: 'sports'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location Name',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Full street address for map linking',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
    }),
    defineField({
      name: 'isFree',
      title: 'Free Event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'cost',
      title: 'Cost',
      type: 'string',
      description: 'e.g. "$10 per person" — leave blank if free',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration / More Info URL',
      type: 'url',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    // --- MYND / special event fields ---
    defineField({
      name: 'customUrl',
      title: 'Custom Landing Page URL',
      type: 'string',
      description:
        'Internal path only — must start with /. e.g. /meet-your-neighbor-day. If set, the event card links here instead of /events/[slug].',
      validation: (Rule) =>
        Rule.custom((val: string | undefined) => {
          if (!val) return true
          return val.startsWith('/') ? true : 'Must be a root-relative path starting with /'
        }),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      description: 'Photos shown in the horizontal scroll strip on the landing page.',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'subEvents',
      title: 'Sub-Events',
      type: 'array',
      description: 'Individual activities shown in the filterable schedule on the landing page.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
            defineField({
              name: 'startTime',
              title: 'Start Time',
              type: 'datetime',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'endTime',
              title: 'End Time',
              type: 'datetime',
            }),
            defineField({
              name: 'locationName',
              title: 'Location Name',
              type: 'string',
              description: 'e.g. "Community Park"',
            }),
            defineField({
              name: 'address',
              title: 'Address',
              type: 'string',
              description: 'Full address — used to create a Google Maps link',
            }),
            defineField({
              name: 'categories',
              title: 'Categories',
              type: 'array',
              description: 'Use lowercase. e.g. games, food, music. Consistent spelling required — filter pills are case-sensitive.',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'isFree',
              title: 'Free',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'startTime'},
            prepare({title, subtitle}) {
              return {
                title,
                subtitle: subtitle
                  ? new Date(subtitle).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                      timeZone: 'America/Chicago',
                    })
                  : '',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
    },
    prepare({title, date, media}) {
      return {
        title,
        subtitle: date
          ? new Date(date).toLocaleDateString('en-US', {dateStyle: 'medium'})
          : 'No date set',
        media,
      }
    },
  },
})
