import {defineType} from 'sanity'

export const eventsHighlights = defineType({
  name: 'eventsHighlights',
  type: 'object',
  title: 'Events Highlights',
  fields: [],
  preview: {
    prepare() {
      return {title: 'Upcoming Events'}
    },
  },
})
