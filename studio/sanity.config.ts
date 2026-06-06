import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineLocations} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

const SINGLETONS = ['navigation']

export default defineConfig({
  name: 'default',
  title: 'City of Argyle',
  projectId: 'dtn82a1i',
  dataset: 'production',
  plugins: [
    presentationTool({
      resolve: {
        locations: {
          page: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) =>
              doc?.slug
                ? {locations: [{title: doc.title || 'Page', href: doc.slug === 'Homepage' ? '/' : `/${doc.slug}`}]}
                : null,
          }),
          event: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) =>
              doc?.slug ? {locations: [{title: doc.title || 'Event', href: `/events/${doc.slug}`}]} : null,
          }),
          newsArticle: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) =>
              doc?.slug ? {locations: [{title: doc.title || 'Article', href: `/news/${doc.slug}`}]} : null,
          }),
          business: defineLocations({
            select: {title: 'name', slug: 'slug.current'},
            resolve: (doc) =>
              doc?.slug ? {locations: [{title: doc.title || 'Business', href: `/business/${doc.slug}`}]} : null,
          }),
        },
      },
      previewUrl: {
        origin: 'https://argyle-web-alpha.vercel.app',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Navigation')
              .id('navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() && !SINGLETONS.includes(item.getId()!),
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
