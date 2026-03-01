<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 text-xl font-bold text-gray-900"
          >
            <span class="text-2xl">✈️</span>
            Voyage Clock
          </NuxtLink>
          <NuxtLink
            to="/plan"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Planning
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="py-12 md:py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Understanding Jet Lag & Circadian Rhythms
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the science behind jet lag and learn evidence-based strategies to minimize its
          effects on your travels.
        </p>
      </div>
    </header>

    <!-- Topics Grid -->
    <section class="py-8 px-4 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Topic Card: Circadian Rhythms -->
          <NuxtLink
            to="/learn/circadian-rhythms"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors"
              >
                🕐
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                Circadian Rhythms
              </h3>
              <p class="text-gray-600 mb-4">
                Learn about your body's internal clock and how it regulates sleep, alertness, and
                other vital functions.
              </p>
              <span class="text-blue-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>

          <!-- Topic Card: How Jet Lag Works -->
          <NuxtLink
            to="/learn/how-jet-lag-works"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl group-hover:bg-orange-600 group-hover:text-white transition-colors"
              >
                🌍
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600">
                How Jet Lag Works
              </h3>
              <p class="text-gray-600 mb-4">
                Understand why crossing time zones disrupts your body and why eastward travel is
                harder than westward.
              </p>
              <span class="text-orange-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>

          <!-- Topic Card: Light Exposure -->
          <NuxtLink
            to="/learn/light-exposure"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-3xl group-hover:bg-yellow-500 group-hover:text-white transition-colors"
              >
                🌞
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600">
                Light Exposure Science
              </h3>
              <p class="text-gray-600 mb-4">
                Discover why light is the most powerful tool for adjusting your circadian rhythm and
                how to use it effectively.
              </p>
              <span class="text-yellow-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>

          <!-- Topic Card: Sleep Strategies -->
          <NuxtLink
            to="/learn/sleep-strategies"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"
              >
                😴
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600">
                Sleep Strategies
              </h3>
              <p class="text-gray-600 mb-4">
                Master the art of pre-adjusting your sleep schedule and maintaining good sleep
                hygiene while traveling.
              </p>
              <span class="text-indigo-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>

          <!-- Topic Card: Exercise & Activity -->
          <NuxtLink
            to="/learn/exercise-activity"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl group-hover:bg-green-600 group-hover:text-white transition-colors"
              >
                🏃
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600">
                Exercise & Activity
              </h3>
              <p class="text-gray-600 mb-4">
                Learn how physical activity timing can help shift your body clock and improve your
                adaptation to new time zones.
              </p>
              <span class="text-green-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>

          <!-- Topic Card: Nutrition & Supplements -->
          <NuxtLink
            to="/learn/nutrition-supplements"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-3xl group-hover:bg-purple-600 group-hover:text-white transition-colors"
              >
                🍽️
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
                Nutrition & Supplements
              </h3>
              <p class="text-gray-600 mb-4">
                Explore meal timing strategies, caffeine management, and the role of melatonin in
                jet lag prevention.
              </p>
              <span class="text-purple-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>

          <!-- Topic Card: Travel Day Tips -->
          <NuxtLink
            to="/learn/travel-day-tips"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl group-hover:bg-red-600 group-hover:text-white transition-colors"
              >
                ✈️
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600">
                Travel Day Tips
              </h3>
              <p class="text-gray-600 mb-4">
                Get practical advice for managing sleep, hydration, and comfort during long flights
                and layovers.
              </p>
              <span class="text-red-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>

          <!-- Topic Card: FAQ -->
          <NuxtLink
            to="/learn/faq"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-3xl group-hover:bg-gray-600 group-hover:text-white transition-colors"
              >
                ❓
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600">
                Frequently Asked Questions
              </h3>
              <p class="text-gray-600 mb-4">
                Find quick answers to common questions about jet lag, circadian rhythms, and travel
                health.
              </p>
              <span class="text-gray-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>

          <!-- Topic Card: Scientific References -->
          <NuxtLink
            to="/learn/scientific-references"
            class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
          >
            <div class="p-6">
              <div
                class="w-16 h-16 mb-4 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-3xl group-hover:bg-teal-600 group-hover:text-white transition-colors"
              >
                📚
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600">
                Scientific References
              </h3>
              <p class="text-gray-600 mb-4">
                Explore the research and studies that form the foundation of our recommendations and
                algorithms.
              </p>
              <span class="text-teal-600 font-medium inline-flex items-center gap-1">
                Read more →
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-lg mb-4">
          Ready to minimize jet lag on your next trip?
        </p>
        <NuxtLink
          to="/plan"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Create Your Travel Plan
        </NuxtLink>
        <p class="text-sm text-gray-500 mt-8">
          © 2025 Voyage Clock. Information provided is for educational purposes only and is not
          medical advice.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Education hub page - links to all educational content
useSeoMeta({
  title: 'Learn About Jet Lag & Circadian Rhythms',
  description: 'Explore science-based educational resources on jet lag, circadian rhythms, light exposure, sleep strategies, and evidence-based travel health.',
  ogTitle: 'Understanding Jet Lag & Circadian Rhythms',
  ogDescription: 'Discover the science behind jet lag and learn evidence-based strategies including light exposure, sleep optimization, and nutrition.',
  ogImage: 'https://voyageclock.pages.dev/og/learn.png',
  ogUrl: 'https://voyageclock.pages.dev/learn/',
  ogType: 'website',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Learn About Jet Lag & Circadian Rhythms',
  twitterDescription: 'Explore science-based educational resources on jet lag prevention and circadian rhythm optimization.',
  twitterImage: 'https://voyageclock.pages.dev/og/learn.png',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://voyageclock.pages.dev/learn/' },
  ],
})

useJsonld({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': 'Jet Lag Education Center',
  'description': 'Comprehensive educational resources about jet lag prevention, circadian rhythms, and science-based travel health strategies.',
  'url': 'https://voyageclock.pages.dev/learn/',
})
</script>
