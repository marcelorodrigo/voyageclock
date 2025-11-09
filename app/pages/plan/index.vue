<template>
  <div class="min-h-screen bg-blue-50 py-8">
    <div class="max-w-7xl mx-auto">
      <TravelInputForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import TravelInputForm from '~/components/forms/TravelInputForm.vue'

definePageMeta({
  title: 'Plan Your Trip | Voyage Clock',
  description: 'Create a personalized jet lag prevention plan. Enter your travel details to get science-based recommendations for your journey.',
  meta: [
    { name: 'description', content: 'Create a personalized jet lag prevention plan. Enter your travel details to get science-based recommendations for your journey.' },
    { property: 'og:title', content: 'Plan Your Trip | Voyage Clock' },
    { property: 'og:description', content: 'Create a personalized jet lag prevention plan. Enter your travel details to get science-based recommendations for your journey.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://voyageclock.com/plan/' },
    { property: 'og:image', content: 'https://voyageclock.com/og/plan.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://voyageclock.com/plan/' }
  ]
})
</script>
