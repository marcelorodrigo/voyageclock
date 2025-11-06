<template>
  <div class="min-h-screen bg-blue-50">
    <!-- Hero Section -->
    <header class="py-16 md:py-24 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
          <span class="text-5xl md:text-6xl">✈️</span>
          Voyage Clock
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
          Minimize jet lag with science-based, personalized travel recommendations
        </p>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Get a customized adaptation plan that includes light exposure timing, sleep schedule adjustments,
          and evidence-based strategies to help you feel your best when you arrive.
        </p>
        <div class="flex justify-center">
          <router-link to="/plan" class="inline-block px-8 py-4 text-lg bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Start Planning Your Trip
          </router-link>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center p-6">
          <span class="text-5xl block mb-4">🌞</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Light Exposure Guidance</h3>
          <p class="text-gray-600">
            Know exactly when to seek or avoid light to quickly adapt to your new timezone.
          </p>
        </div>

        <div class="text-center p-6">
          <span class="text-5xl block mb-4">😴</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Sleep Schedule Optimization</h3>
          <p class="text-gray-600">
            Gradually adjust your sleep times before departure for a smoother transition.
          </p>
        </div>

        <div class="text-center p-6">
          <span class="text-5xl block mb-4">🎯</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Personalized Timeline</h3>
          <p class="text-gray-600">
            Get a day-by-day plan tailored to your specific trip and sleep patterns.
          </p>
        </div>

        <div class="text-center p-6">
          <span class="text-5xl block mb-4">🔬</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Science-Based</h3>
          <p class="text-gray-600">
            Recommendations based on circadian rhythm research and sleep medicine.
          </p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 px-4 bg-blue-50">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            1
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Enter Your Travel Details</h3>
          <p class="text-gray-600">
            Tell us where you're going, when you're leaving, and your typical sleep schedule.
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            2
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Get Your Personalized Plan</h3>
          <p class="text-gray-600">
            Receive a detailed timeline with specific recommendations for before, during, and after your flight.
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            3
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Follow the Guidance</h3>
          <p class="text-gray-600">
            Implement the strategies to minimize jet lag and feel great at your destination.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 bg-blue-600">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Beat Jet Lag?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Start planning your trip now and get your personalized adaptation plan in minutes.
        </p>
        <router-link to="/plan" class="inline-block px-8 py-4 text-lg bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
          Create Your Plan
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Home page - landing page for the application
</script>

