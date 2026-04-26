import {defineField, defineType} from 'sanity'

export const business = defineType({
  name: 'business',
  type: 'document',
  title: 'Business',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Business Name',
      description: 'The name of the business',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'URL-friendly version of the business name',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      type: 'object',
      title: 'Address',
      fields: [
        defineField({
          name: 'street',
          type: 'string',
          title: 'Street Address',
          description: 'Street address with number',
        }),
        defineField({
          name: 'city',
          type: 'string',
          title: 'City',
          initialValue: 'Argyle',
        }),
        defineField({
          name: 'state',
          type: 'string',
          title: 'State',
          initialValue: 'MN',
        }),
        defineField({
          name: 'zipCode',
          type: 'string',
          title: 'ZIP Code',
        }),
      ],
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Phone Number',
      description: 'Format: (218) 437-8200',
    }),
    defineField({
      name: 'website',
      type: 'url',
      title: 'Website',
      description: 'Full URL including https://',
    }),
    defineField({
      name: 'email',
      type: 'email',
      title: 'Email Address',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Business Description',
      description: 'Brief description of the business and services',
      rows: 4,
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Business Category',
      options: {
        list: [
          {title: 'Agriculture', value: 'agriculture'},
          {title: 'Automotive', value: 'automotive'},
          {title: 'Construction', value: 'construction'},
          {title: 'Food & Dining', value: 'food-dining'},
          {title: 'Healthcare', value: 'healthcare'},
          {title: 'Insurance', value: 'insurance'},
          {title: 'Manufacturing', value: 'manufacturing'},
          {title: 'Professional Services', value: 'professional-services'},
          {title: 'Retail', value: 'retail'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'logo',
      type: 'image',
      title: 'Business Logo',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'hours',
      type: 'object',
      title: 'Business Hours',
      fields: [
        defineField({
          name: 'monday',
          type: 'string',
          title: 'Monday',
          placeholder: '9:00 AM - 5:00 PM',
        }),
        defineField({
          name: 'tuesday',
          type: 'string',
          title: 'Tuesday',
          placeholder: '9:00 AM - 5:00 PM',
        }),
        defineField({
          name: 'wednesday',
          type: 'string',
          title: 'Wednesday',
          placeholder: '9:00 AM - 5:00 PM',
        }),
        defineField({
          name: 'thursday',
          type: 'string',
          title: 'Thursday',
          placeholder: '9:00 AM - 5:00 PM',
        }),
        defineField({
          name: 'friday',
          type: 'string',
          title: 'Friday',
          placeholder: '9:00 AM - 5:00 PM',
        }),
        defineField({
          name: 'saturday',
          type: 'string',
          title: 'Saturday',
          placeholder: 'Closed',
        }),
        defineField({
          name: 'sunday',
          type: 'string',
          title: 'Sunday',
          placeholder: 'Closed',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured Business',
      description: 'Show this business prominently on the page',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'address.street',
      media: 'logo',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title,
        subtitle: subtitle || 'No address provided',
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Business Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
})
