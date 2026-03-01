<template>
  <div class="min-h-screen bg-blue-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span class="text-2xl">✈️</span>
            Voyage Clock
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/learn"
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Learn
            </NuxtLink>
            <NuxtLink
              to="/plan"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Planning
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="py-16 md:py-24 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1
          class="text-4xl md:text-6xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4"
        >
          <span class="text-5xl md:text-6xl">✈️</span>
          Voyage Clock
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
          Minimize jet lag with science-based, personalized travel recommendations
        </p>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Get a customized adaptation plan that includes light exposure timing, sleep schedule
          adjustments, and evidence-based strategies to help you feel your best when you arrive.
        </p>
        <div class="flex justify-center gap-4 flex-wrap">
          <NuxtLink
            to="/plan"
            class="inline-block px-8 py-4 text-lg bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Planning Your Trip
          </NuxtLink>
          <NuxtLink
            to="/learn"
            class="inline-block px-8 py-4 text-lg bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Learn the Science
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center p-6">
          <span class="text-5xl block mb-4">🌞</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Light Exposure Guidance
          </h3>
          <p class="text-gray-600">
            Know exactly when to seek or avoid light to quickly adapt to your new timezone.
          </p>
        </div>

        <div class="text-center p-6">
          <span class="text-5xl block mb-4">😴</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Sleep Schedule Optimization
          </h3>
          <p class="text-gray-600">
            Gradually adjust your sleep times before departure for a smoother transition.
          </p>
        </div>

        <div class="text-center p-6">
          <span class="text-5xl block mb-4">🎯</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Personalized Timeline
          </h3>
          <p class="text-gray-600">
            Get a day-by-day plan tailored to your specific trip and sleep patterns.
          </p>
        </div>

        <div class="text-center p-6">
          <span class="text-5xl block mb-4">🔬</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Science-Based
          </h3>
          <p class="text-gray-600">
            Recommendations based on circadian rhythm research and sleep medicine.
          </p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 px-4 bg-blue-50">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        How It Works
      </h2>
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold"
          >
            1
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Enter Your Travel Details
          </h3>
          <p class="text-gray-600">
            Tell us where you're going, when you're leaving, and your typical sleep schedule.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold"
          >
            2
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Get Your Personalized Plan
          </h3>
          <p class="text-gray-600">
            Receive a detailed timeline with specific recommendations for before, during, and after
            your flight.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold"
          >
            3
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Follow the Guidance
          </h3>
          <p class="text-gray-600">
            Implement the strategies to minimize jet lag and feel great at your destination.
          </p>
        </div>
      </div>
    </section>

    <!-- Learn Section -->
    <section class="py-16 px-4 bg-white border-t border-gray-200">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Want to Learn the Science?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Explore our comprehensive educational resources on circadian rhythms, jet lag, and
          evidence-based strategies.
        </p>
        <NuxtLink
          to="/learn"
          class="inline-block px-8 py-4 text-lg bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Explore Educational Content
        </NuxtLink>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 bg-blue-600">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Beat Jet Lag?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Start planning your trip now and get your personalized adaptation plan in minutes.
        </p>
        <NuxtLink
          to="/plan"
          class="inline-block px-8 py-4 text-lg bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
        >
          Create Your Plan
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Home page - landing page for the application
useSeoMeta({
  title: 'Voyage Clock: Beat Jet Lag with Science',
  description: 'Personalized, science-based jet lag prevention plans. Light exposure timing, sleep schedules, and evidence-based travel strategies.',
  ogTitle: 'Voyage Clock - Beat Jet Lag with Science',
  ogDescription: 'Get a personalized adaptation plan with light exposure timing, sleep adjustments, and proven strategies to feel your best when traveling.',
  ogImage: 'https://voyageclock.pages.dev/og/home.png',
  ogUrl: 'https://voyageclock.pages.dev',
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Voyage Clock: Beat Jet Lag with Science',
  twitterDescription: 'Minimize jet lag with personalized, evidence-based travel recommendations.',
  twitterImage: 'https://voyageclock.pages.dev/og/home.png',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://voyageclock.pages.dev' },
  ],
})

useJsonld({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Voyage Clock',
  'description': 'Science-based jet lag prevention and personalized travel adaptation plans.',
  'url': 'https://voyageclock.pages.dev',
  'publisher': {
    '@type': 'Organization',
    'name': 'Voyage Clock',
  },
  'potentialAction': {
    '@type': 'SearchAction',
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': 'https://voyageclock.pages.dev/plan',
    },
    'query-input': 'required name=travel-details',
  },
})
</script>
