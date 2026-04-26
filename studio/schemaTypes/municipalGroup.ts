import {defineField, defineType} from 'sanity'

export const municipalGroup = defineType({
  name: 'municipalGroup',
  type: 'object',
  title: 'Municipal Group',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Group Title',
      description: "e.g., 'City Office', 'City Council', 'Planning Commission', etc.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'groupType',
      type: 'string',
      title: 'Group Type',
      options: {
        list: [
          {title: 'City Office/Department', value: 'office'},
          {title: 'City Council', value: 'council'},
          {title: 'Commission/Board', value: 'commission'},
          {title: 'Committee', value: 'committee'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Brief description of this group or department',
      rows: 3,
    }),
    defineField({
      name: 'members',
      type: 'array',
      title: 'Members/Staff',
      of: [
        {
          type: 'object',
          name: 'member',
          title: 'Member',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Full Name',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              type: 'string',
              title: 'Position/Title',
              description: "e.g., 'Mayor', 'City Council', 'City Clerk', 'Water Supervisor'",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'email',
              type: 'email',
              title: 'Email Address',
            }),
            defineField({
              name: 'phone',
              type: 'string',
              title: 'Phone Number',
              description: 'Format: (218) 437-8200',
            }),
            defineField({
              name: 'extension',
              type: 'string',
              title: 'Phone Extension',
            }),
            defineField({
              name: 'photo',
              type: 'image',
              title: 'Photo',
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
              name: 'bio',
              type: 'text',
              title: 'Biography/Description',
              description: 'Brief bio or additional information',
              rows: 3,
            }),
            defineField({
              name: 'termStart',
              type: 'date',
              title: 'Term Start Date',
              description: 'For elected officials - when their term started',
            }),
            defineField({
              name: 'termEnd',
              type: 'date',
              title: 'Term End Date',
              description: 'For elected officials - when their term ends',
            }),
            defineField({
              name: 'displayOrder',
              type: 'number',
              title: 'Display Order',
              description: 'Order in which this person should appear (lower numbers first)',
              initialValue: 1,
            }),
            defineField({
              name: 'isActive',
              type: 'boolean',
              title: 'Currently Active',
              description: 'Uncheck to hide from public display',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role',
              media: 'photo',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'meetingInfo',
      type: 'object',
      title: 'Meeting Information',
      description: 'For councils, commissions, and committees',
      fields: [
        defineField({
          name: 'hasMeetings',
          type: 'boolean',
          title: 'This group holds regular meetings',
          initialValue: false,
        }),
        defineField({
          name: 'schedule',
          type: 'string',
          title: 'Meeting Schedule',
          description: "e.g., 'First Monday of each month', 'Second Tuesday at 6:00 PM'",
          hidden: ({parent}) => !parent?.hasMeetings,
        }),
        defineField({
          name: 'time',
          type: 'string',
          title: 'Meeting Time',
          description: "e.g., '7:00 PM', '6:30 PM'",
          hidden: ({parent}) => !parent?.hasMeetings,
        }),
        defineField({
          name: 'location',
          type: 'string',
          title: 'Meeting Location',
          description: "e.g., 'City Hall', 'Clerk's Office', 'Community Center'",
          hidden: ({parent}) => !parent?.hasMeetings,
        }),
        defineField({
          name: 'additionalInfo',
          type: 'text',
          title: 'Additional Meeting Info',
          description: 'Any other relevant meeting information',
          rows: 2,
          hidden: ({parent}) => !parent?.hasMeetings,
        }),
      ],
    }),
    defineField({
      name: 'officeHours',
      type: 'object',
      title: 'Office/Service Hours',
      description: 'For offices and departments with public hours',
      fields: [
        defineField({
          name: 'hasHours',
          type: 'boolean',
          title: 'This group has public service hours',
          initialValue: false,
        }),
        defineField({
          name: 'hoursText',
          type: 'text',
          title: 'Hours Description',
          description:
            "Simple text description (e.g., 'Monday-Thursday 7:00AM-4:30PM, Friday 7:00AM-11:00AM')",
          rows: 2,
          hidden: ({parent}) => !parent?.hasHours,
        }),
        defineField({
          name: 'detailedHours',
          type: 'object',
          title: 'Detailed Hours',
          description: 'Structured hours for more complex display',
          hidden: ({parent}) => !parent?.hasHours,
          fields: [
            defineField({
              name: 'monday',
              type: 'object',
              title: 'Monday',
              fields: [
                defineField({
                  name: 'isOpen',
                  type: 'boolean',
                  title: 'Open',
                  initialValue: true,
                }),
                defineField({
                  name: 'openTime',
                  type: 'string',
                  title: 'Opens',
                  placeholder: '7:00 AM',
                }),
                defineField({
                  name: 'closeTime',
                  type: 'string',
                  title: 'Closes',
                  placeholder: '4:30 PM',
                }),
              ],
            }),
            defineField({
              name: 'tuesday',
              type: 'object',
              title: 'Tuesday',
              fields: [
                defineField({
                  name: 'isOpen',
                  type: 'boolean',
                  title: 'Open',
                  initialValue: true,
                }),
                defineField({
                  name: 'openTime',
                  type: 'string',
                  title: 'Opens',
                  placeholder: '7:00 AM',
                }),
                defineField({
                  name: 'closeTime',
                  type: 'string',
                  title: 'Closes',
                  placeholder: '4:30 PM',
                }),
              ],
            }),
            defineField({
              name: 'wednesday',
              type: 'object',
              title: 'Wednesday',
              fields: [
                defineField({
                  name: 'isOpen',
                  type: 'boolean',
                  title: 'Open',
                  initialValue: true,
                }),
                defineField({
                  name: 'openTime',
                  type: 'string',
                  title: 'Opens',
                  placeholder: '7:00 AM',
                }),
                defineField({
                  name: 'closeTime',
                  type: 'string',
                  title: 'Closes',
                  placeholder: '4:30 PM',
                }),
              ],
            }),
            defineField({
              name: 'thursday',
              type: 'object',
              title: 'Thursday',
              fields: [
                defineField({
                  name: 'isOpen',
                  type: 'boolean',
                  title: 'Open',
                  initialValue: true,
                }),
                defineField({
                  name: 'openTime',
                  type: 'string',
                  title: 'Opens',
                  placeholder: '7:00 AM',
                }),
                defineField({
                  name: 'closeTime',
                  type: 'string',
                  title: 'Closes',
                  placeholder: '4:30 PM',
                }),
              ],
            }),
            defineField({
              name: 'friday',
              type: 'object',
              title: 'Friday',
              fields: [
                defineField({
                  name: 'isOpen',
                  type: 'boolean',
                  title: 'Open',
                  initialValue: true,
                }),
                defineField({
                  name: 'openTime',
                  type: 'string',
                  title: 'Opens',
                  placeholder: '7:00 AM',
                }),
                defineField({
                  name: 'closeTime',
                  type: 'string',
                  title: 'Closes',
                  placeholder: '11:00 AM',
                }),
              ],
            }),
            defineField({
              name: 'saturday',
              type: 'object',
              title: 'Saturday',
              fields: [
                defineField({
                  name: 'isOpen',
                  type: 'boolean',
                  title: 'Open',
                  initialValue: false,
                }),
                defineField({
                  name: 'openTime',
                  type: 'string',
                  title: 'Opens',
                }),
                defineField({
                  name: 'closeTime',
                  type: 'string',
                  title: 'Closes',
                }),
              ],
            }),
            defineField({
              name: 'sunday',
              type: 'object',
              title: 'Sunday',
              fields: [
                defineField({
                  name: 'isOpen',
                  type: 'boolean',
                  title: 'Open',
                  initialValue: false,
                }),
                defineField({
                  name: 'openTime',
                  type: 'string',
                  title: 'Opens',
                }),
                defineField({
                  name: 'closeTime',
                  type: 'string',
                  title: 'Closes',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'contactInfo',
      type: 'object',
      title: 'Contact Information',
      fields: [
        defineField({
          name: 'address',
          type: 'text',
          title: 'Physical Address',
          rows: 2,
        }),
        defineField({
          name: 'mailingAddress',
          type: 'text',
          title: 'Mailing Address',
          description: 'If different from physical address',
          rows: 2,
        }),
        defineField({
          name: 'mainPhone',
          type: 'string',
          title: 'Main Phone Number',
          description: 'Format: (218) 437-8200',
        }),
        defineField({
          name: 'fax',
          type: 'string',
          title: 'Fax Number',
        }),
        defineField({
          name: 'email',
          type: 'email',
          title: 'General Email',
        }),
      ],
    }),
    defineField({
      name: 'additionalContent',
      type: 'array',
      title: 'Additional Content',
      description: 'Any additional information blocks',
      of: [
        {
          type: 'object',
          name: 'contentBlock',
          title: 'Content Block',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Block Title',
            }),
            defineField({
              name: 'content',
              type: 'text',
              title: 'Content',
              rows: 4,
            }),
            defineField({
              name: 'displayOrder',
              type: 'number',
              title: 'Display Order',
              initialValue: 1,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'content',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'specialNotices',
      type: 'array',
      title: 'Special Notices',
      description: 'Holiday schedules, meeting cancellations, etc.',
      of: [
        {
          type: 'object',
          name: 'notice',
          title: 'Notice',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Notice Title',
            }),
            defineField({
              name: 'message',
              type: 'text',
              title: 'Notice Message',
              rows: 3,
            }),
            defineField({
              name: 'startDate',
              type: 'date',
              title: 'Start Date',
            }),
            defineField({
              name: 'endDate',
              type: 'date',
              title: 'End Date',
            }),
            defineField({
              name: 'isActive',
              type: 'boolean',
              title: 'Currently Active',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'message',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'displaySettings',
      type: 'object',
      title: 'Display Settings',
      fields: [
        defineField({
          name: 'showPhotos',
          type: 'boolean',
          title: 'Show member photos',
          initialValue: true,
        }),
        defineField({
          name: 'showContactInfo',
          type: 'boolean',
          title: 'Show individual contact information',
          initialValue: true,
        }),
        defineField({
          name: 'columnsPerRow',
          type: 'number',
          title: 'Members per row',
          description: 'How many members to show per row',
          options: {
            list: [
              {title: '2 per row', value: 2},
              {title: '3 per row', value: 3},
              {title: '4 per row', value: 4},
            ],
          },
          initialValue: 2,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      groupType: 'groupType',
      description: 'description',
    },
    prepare(selection) {
      const {title, groupType, description} = selection
      const typeLabels: Record<string, string> = {
        office: 'Office/Department',
        council: 'City Council',
        commission: 'Commission/Board',
        committee: 'Committee',
        other: 'Other',
      }
      return {
        title: title,
        subtitle: typeLabels[groupType] || groupType,
        description: description,
      }
    },
  },
})
