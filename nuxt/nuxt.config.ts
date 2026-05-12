// 1. External imports

// 2. Internal imports
import { getBlogRoutes } from './app/domains/blog/blog.repository'

const blogRoutes = getBlogRoutes()

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'es',
      },
      meta: [
        {
          content:
            'Mini version Nuxt de FutStats con blog SSG, jugadores SSR y herramientas CSR.',
          name: 'description',
        },
      ],
      title: 'FutStats Nuxt',
    },
  },
  compatibilityDate: '2026-05-11',
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  nitro: {
    prerender: {
      routes: blogRoutes,
    },
  },
  routeRules: {
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/players': { ssr: true },
    '/players/**': { ssr: true },
    '/tools': { ssr: false },
    '/tools/**': { ssr: false },
  },
})
