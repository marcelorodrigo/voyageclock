<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Loading State -->
      <div
        v-if="travelPlan.isGenerating"
        class="flex flex-col items-center justify-center min-h-[60vh] text-center p-8"
      >
        <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <p class="mt-6 text-lg text-gray-600">
          Generating your personalized plan...
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="travelPlan.generationError"
        class="flex flex-col items-center justify-center min-h-[60vh] text-center p-8"
      >
        <div class="text-6xl mb-4">
          ⚠️
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Unable to Generate Plan
        </h2>
        <p class="text-lg text-gray-500 mb-8 max-w-lg">
          {{ travelPlan.generationError }}
        </p>
        <button
          class="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer border-none"
          @click="goBack"
        >
          Go Back
        </button>
      </div>

      <!-- No Plan State -->
      <div
        v-else-if="!travelPlan.travelPlan"
        class="flex flex-col items-center justify-center min-h-[60vh] text-center p-8"
      >
        <div class="text-6xl mb-4">
          📋
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          No Plan Found
        </h2>
        <p class="text-lg text-gray-500 mb-8 max-w-lg">
          Please fill out the travel form to generate your plan.
        </p>
        <button
          class="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer border-none"
          @click="goBack"
        >
          Create Plan
        </button>
      </div>

      <!-- Plan Display -->
      <div v-else>
        <RecommendationsPlan :plan="travelPlan.travelPlan" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTravelPlan } from '~/composables/useTravelPlan'
import RecommendationsPlan from '~/components/recommendations/RecommendationsPlan.vue'

const router = useRouter()
const travelPlan = useTravelPlan()

onMounted(async () => {
  if (!travelPlan.hasValidParams()) {
    router.push({ name: 'plan' })
    return
  }

  if (!travelPlan.travelPlan) {
    await travelPlan.generatePlan()
  }
})

function goBack() {
  router.push({ name: 'plan' })
}

useSeoMeta({
  title: 'Your Personalized Jet Lag Plan Results',
  description: 'View your customized jet lag prevention plan with recommendations for sleep timing, light exposure, nutrition, and travel strategies.',
  ogTitle: 'Your Personalized Jet Lag Plan',
  ogDescription: 'Your custom adaptation plan with day-by-day recommendations to minimize jet lag and feel your best.',
  ogImage: 'https://voyageclock.pages.dev/og/results.png',
  ogUrl: 'https://voyageclock.pages.dev/plan/results',
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Your Personalized Jet Lag Plan',
  twitterDescription: 'View your custom jet lag prevention plan with detailed recommendations.',
  twitterImage: 'https://voyageclock.pages.dev/og/results.png',
  robots: 'noindex, nofollow',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://voyageclock.pages.dev/plan/' },
  ],
})
</script>
