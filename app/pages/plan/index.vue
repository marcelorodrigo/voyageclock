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
  title: 'Plan Your Trip - Personalized Jet Lag Prevention | Voyage Clock',
  description: 'Create a personalized jet lag prevention plan. Enter your travel details to get science-based recommendations including light exposure timing, sleep schedules, and travel strategies.',
  ogTitle: 'Plan Your Trip - Custom Jet Lag Prevention | Voyage Clock',
  ogDescription: 'Get a personalized adaptation plan with specific recommendations for your journey. Enter your travel details and receive evidence-based strategies to minimize jet lag.',
  ogImage: 'https://voyageclock.com/og/plan.png',
  ogUrl: 'https://voyageclock.com/plan/',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Plan Your Trip - Personalized Jet Lag Prevention',
  twitterDescription: 'Create your custom jet lag prevention plan with science-based recommendations for your specific journey.',
  twitterImage: 'https://voyageclock.com/og/plan.png',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://voyageclock.com/plan/' }
  ]
})
</script>
