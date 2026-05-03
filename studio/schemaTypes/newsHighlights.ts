import {defineType} from 'sanity'

export const newsHighlights = defineType({
  name: 'newsHighlights',
  type: 'object',
  title: 'News Highlights',
  fields: [],
  preview: {
    prepare() {
      return {title: 'News & Announcements'}
    },
  },
})
