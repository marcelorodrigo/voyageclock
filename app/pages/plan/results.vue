<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Loading State -->
      <div v-if="travelStore.isGenerating" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Generating your personalized plan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="travelStore.generationError" class="error-container">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">Unable to Generate Plan</h2>
        <p class="error-message">{{ travelStore.generationError }}</p>
        <button @click="goBack" class="btn btn-primary">Go Back</button>
      </div>

      <!-- No Plan State -->
      <div v-else-if="!travelStore.travelPlan" class="no-plan-container">
        <div class="no-plan-icon">📋</div>
        <h2 class="no-plan-title">No Plan Found</h2>
        <p class="no-plan-message">Please fill out the travel form to generate your plan.</p>
        <button @click="goBack" class="btn btn-primary">Create Plan</button>
      </div>

      <!-- Plan Display -->
      <div v-else>
        <RecommendationsPlan :plan="travelStore.travelPlan" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTravelStore } from '~/stores/travelStore'
import RecommendationsPlan from '~/components/recommendations/RecommendationsPlan.vue'

const router = useRouter()
const travelStore = useTravelStore()

onMounted(() => {
  // If no plan exists and not generating, redirect to input form
  if (!travelStore.travelPlan && !travelStore.isGenerating) {
    router.push({ name: 'plan-input' })
  }
})

function goBack() {
  router.push({ name: 'plan-input' })
}
</script>

<style scoped>
.loading-container,
.error-container,
.no-plan-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 1.5rem;
  font-size: 1.125rem;
  color: #4b5563;
}

.error-icon,
.no-plan-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title,
.no-plan-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.error-message,
.no-plan-message {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 32rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}
</style>

