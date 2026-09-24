// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  site: {
    url: process.env.NUXT_SITE_URL || 'http://localhost:3000',
    name: 'VoyageClock',
  },
  devtools: { enabled: true },
  modules: ['@nuxt/test-utils', '@nuxtjs/seo', '@nuxtjs/tailwindcss', '@nuxt/eslint'],
  tailwindcss: { cssPath: '~/assets/css/tailwind.css' },
  ogImage: { enabled: false }
})
