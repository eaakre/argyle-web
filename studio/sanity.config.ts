import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {map} from 'rxjs'
import {schemaTypes} from './schemaTypes'

const SINGLETONS = ['navigation']

const hrefFor: Record<string, (slug: string) => string> = {
  page: (slug) => (slug === 'Homepage' ? '/' : `/${slug}`),
  event: (slug) => `/events/${slug}`,
  newsArticle: (slug) => `/news/${slug}`,
  business: (slug) => `/business/${slug}`,
}

export default defineConfig({
  name: 'default',
  title: 'City of Argyle',
  projectId: 'dtn82a1i',
  dataset: 'production',
  plugins: [
    presentationTool({
      locate: ({id, type}, context) => {
        if (!(type in hrefFor)) return null
        return context.documentStore
          .listenQuery(`*[_id == $id][0]{title, slug}`, {id}, {perspective: 'previewDrafts'})
          .pipe(
            map((doc) => {
              const slug = doc?.slug?.current
              if (!slug) return {message: 'Missing slug', tone: 'caution' as const}
              return {
                locations: [{title: doc?.title ?? type, href: hrefFor[type](slug)}],
              }
            }),
          )
      },
      previewUrl: {
        origin: 'http://localhost:3000',
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
