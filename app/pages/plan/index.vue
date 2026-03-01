<template>
  <div class="min-h-screen bg-blue-50 py-8">
    <div class="max-w-7xl mx-auto">
      <TravelInputForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import TravelInputForm from '~/components/forms/TravelInputForm.vue'

useSeoMeta({
  title: 'Plan Your Trip - Personalized Jet Lag Prevention',
  description: 'Create a personalized jet lag prevention plan. Enter your travel details to get science-based recommendations for light exposure, sleep, and travel.',
  ogTitle: 'Plan Your Trip - Custom Jet Lag Prevention',
  ogDescription: 'Get a personalized adaptation plan with specific recommendations for your journey. Enter your travel details for evidence-based strategies.',
  ogImage: 'https://voyageclock.pages.dev/og/plan.png',
  ogUrl: 'https://voyageclock.pages.dev/plan/',
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Plan Your Trip - Personalized Jet Lag Prevention',
  twitterDescription: 'Create your custom jet lag prevention plan with science-based recommendations.',
  twitterImage: 'https://voyageclock.pages.dev/og/plan.png',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://voyageclock.pages.dev/plan/' },
  ],
})

useJsonld({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': 'Voyage Clock - Trip Planner',
  'description': 'Create a personalized jet lag prevention plan based on your travel details.',
  'url': 'https://voyageclock.pages.dev/plan/',
  'applicationCategory': 'HealthApplication',
  'operatingSystem': 'Web Browser',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
})
</script>
