// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/test-utils/module', 'nuxt-jsonld'],
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Voyage Clock',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-07-15',

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  eslint: {
    checker: true,
    config: {
      stylistic: true, // turn on code formatting
    },
  },

  jsonld: {
    inject: true,
    compact: true,
  },
})
