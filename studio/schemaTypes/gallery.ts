import {defineType, defineField} from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  type: 'object',
  title: 'Image Gallery',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Gallery Title',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryImage',
          title: 'Image',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
            },
            {name: 'caption', title: 'Caption', type: 'string'},
            {name: 'alt', title: 'Alt Text', type: 'string'},
          ],
        },
        {
          type: 'object',
          name: 'galleryVideo',
          title: 'Video',
          fields: [
            {name: 'url', title: 'Video URL', type: 'url'},
            {name: 'caption', title: 'Caption', type: 'string'},
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
    },
    prepare({title, media}) {
      return {
        title: title || 'Image Gallery',
        media,
      }
    },
  },
})
