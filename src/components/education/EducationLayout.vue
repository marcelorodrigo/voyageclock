<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-8">
            <router-link to="/" class="flex items-center gap-2 text-xl font-bold text-gray-900">
              <span class="text-2xl">✈️</span>
              <span class="hidden sm:inline">Voyage Clock</span>
            </router-link>
            <router-link
              to="/learn"
              class="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← All Topics
            </router-link>
          </div>
          <router-link
            to="/plan"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Start Planning
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="py-8 md:py-12 px-4">
      <article class="max-w-4xl mx-auto">
        <!-- Icon and Title -->
        <div class="text-center mb-8">
          <div
            class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-5xl"
            :class="iconBgClass"
          >
            {{ icon }}
          </div>
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-xl text-gray-600 max-w-2xl mx-auto">
            {{ subtitle }}
          </p>
        </div>

        <!-- Article Content -->
        <div class="bg-white rounded-xl shadow-md p-6 md:p-10 prose prose-lg max-w-none">
          <slot />
        </div>

        <!-- Related Topics -->
        <div v-if="relatedTopics && relatedTopics.length > 0" class="mt-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Topics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <router-link
              v-for="topic in relatedTopics"
              :key="topic.path"
              :to="topic.path"
              class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300"
            >
              <div class="flex items-start gap-4">
                <div class="text-3xl">{{ topic.icon }}</div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600">
                    {{ topic.title }}
                  </h3>
                  <p class="text-gray-600 text-sm">{{ topic.description }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="mt-12 bg-blue-50 rounded-xl p-8 text-center border border-blue-100">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Ready to Apply This Knowledge?</h2>
          <p class="text-gray-600 mb-6">
            Create a personalized jet lag prevention plan for your next trip.
          </p>
          <router-link
            to="/plan"
            class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Your Plan
          </router-link>
        </div>
      </article>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-8 px-4 mt-16">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-sm text-gray-500">
          © 2025 Voyage Clock. Information provided is for educational purposes only and is not
          medical advice.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface RelatedTopic {
  path: string
  icon: string
  title: string
  description: string
}

interface Props {
  icon: string
  title: string
  subtitle?: string
  iconBgClass?: string
  relatedTopics?: RelatedTopic[]
}

withDefaults(defineProps<Props>(), {
  iconBgClass: 'bg-blue-100',
  relatedTopics: () => [],
})
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose h2 {
  color: #111827;
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.prose ul,
.prose ol {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose strong {
  color: #111827;
  font-weight: 600;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  font-style: italic;
  color: #4b5563;
  margin: 1.5rem 0;
}
</style>

