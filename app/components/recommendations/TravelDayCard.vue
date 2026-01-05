<template>
  <div class="travel-day-card">
    <div class="card-header">
      <div class="header-content">
        <h3 class="header-title">
          {{ formatDateLabel }}
        </h3>
        <p class="header-subtitle">
          Your journey begins
        </p>
      </div>
    </div>

    <div class="card-body">
      <!-- Sleep Strategy -->
      <div
        v-if="recommendation.sleepStrategy"
        class="strategy-section"
      >
        <div class="section-header">
          <span class="section-icon">😴</span>
          <h4 class="section-title">
            Sleep Strategy
          </h4>
        </div>
        <p class="section-content">
          {{ recommendation.sleepStrategy }}
        </p>
      </div>

      <!-- Light Exposure -->
      <div
        v-if="recommendation.lightExposure"
        class="strategy-section"
      >
        <div class="section-header">
          <span class="section-icon">🌞</span>
          <h4 class="section-title">
            Light Management
          </h4>
        </div>
        <p class="section-content">
          {{ recommendation.lightExposure }}
        </p>
      </div>

      <!-- Meal Timing -->
      <div
        v-if="recommendation.mealTiming"
        class="strategy-section"
      >
        <div class="section-header">
          <span class="section-icon">🍽️</span>
          <h4 class="section-title">
            Meal Timing
          </h4>
        </div>
        <p class="section-content">
          {{ recommendation.mealTiming }}
        </p>
      </div>

      <!-- Hydration -->
      <div
        v-if="recommendation.hydration"
        class="strategy-section"
      >
        <div class="section-header">
          <span class="section-icon">💧</span>
          <h4 class="section-title">
            Hydration
          </h4>
        </div>
        <p class="section-content">
          {{ recommendation.hydration }}
        </p>
      </div>

      <!-- Movement -->
      <div
        v-if="recommendation.movement"
        class="strategy-section"
      >
        <div class="section-header">
          <span class="section-icon">🚶</span>
          <h4 class="section-title">
            Movement & Stretching
          </h4>
        </div>
        <p class="section-content">
          {{ recommendation.movement }}
        </p>
      </div>

      <!-- General Notes -->
      <div
        v-if="recommendation.generalNotes && recommendation.generalNotes.length > 0"
        class="general-notes"
      >
        <h4 class="notes-title">
          ✈️ Travel Tips
        </h4>
        <ul class="notes-list">
          <li
            v-for="(note, index) in recommendation.generalNotes"
            :key="index"
          >
            {{ note }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TravelDayRecommendation, TravelPlan } from '~/types/travel'
import { formatDateReadable } from '~/utils/dateTimeUtils'

const props = defineProps<{
  recommendation: TravelDayRecommendation
  plan: TravelPlan
}>()

const formatDateLabel = computed(() => {
  const date = new Date(props.recommendation.date)
  const formatted = formatDateReadable(date)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  return `${dayName}, ${formatted}`
})
</script>

<style scoped>
.travel-day-card {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.header-content {
  color: #ffffff;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.header-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
  background-color: #ffffff;
}

.strategy-section {
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.strategy-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
}

.section-icon {
  font-size: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.section-content {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  padding-left: 2rem;
}

.general-notes {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.5rem;
  border: 1px solid #fbbf24;
}

.notes-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 0.625rem 0;
}

.notes-list {
  list-style: none;
  padding: 0;
  margin: 0;
  color: #78350f;
  font-size: 0.875rem;
  line-height: 1.6;
}

.notes-list li {
  padding-left: 1.25rem;
  position: relative;
  margin-bottom: 0.5rem;
}

.notes-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #f59e0b;
  font-weight: 700;
}

.notes-list li:last-child {
  margin-bottom: 0;
}

@media print {
  .travel-day-card {
    background: #ffffff;
    box-shadow: none;
    border: 2px solid #f97316;
  }

  .card-header {
    background-color: #ffedd5;
    border-bottom-color: #f97316;
  }

  .header-content {
    color: #111827;
  }

  .general-notes {
    background: #fef3c7;
  }
}
</style>
