// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  site: {
    url: process.env.NUXT_SITE_URL || 'http://localhost:3000',
    name: 'VoyageClock',
  },
  devtools: { enabled: true },
  modules: ['@nuxt/test-utils', '@nuxtjs/seo', '@nuxtjs/tailwindcss', '@nuxt/eslint', '@nuxtjs/i18n'],
  tailwindcss: { cssPath: '~/assets/css/tailwind.css' },
  ogImage: { enabled: false },
  nitro: {
    prerender: {
      routes: ['pt', 'es', 'fr', 'nl'].flatMap(locale => [
        `/${locale}`,
        `/${locale}/plan`,
        `/${locale}/science`,
      ]),
    },
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    langDir: 'locales',
    detectBrowserLanguage: false,
    baseUrl: process.env.NUXT_SITE_URL,
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'pt', language: 'pt-BR', name: 'Português (Brasil)', file: 'pt.json' },
      { code: 'es', language: 'es', name: 'Español', file: 'es.json' },
      { code: 'fr', language: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'nl', language: 'nl', name: 'Nederlands', file: 'nl.json' },
    ],
    vueI18n: '../i18n.config.ts',
  },
})
