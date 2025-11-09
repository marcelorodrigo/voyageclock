<template>
  <div class="daily-timeline">
    <div class="timeline-header">
      <div class="timeline-date">
        <div class="day-number">
          <span v-if="phase === 'pre-travel'">Day {{ Math.abs(recommendation.dayNumber) }}</span>
          <span v-else>Day {{ recommendation.dayNumber }}</span>
        </div>
        <div class="date-label">{{ formatDateLabel }}</div>
      </div>
      <div class="sleep-summary">
        <span class="sleep-icon">😴</span>
        <span class="sleep-time"
          >{{ recommendation.sleep.bedtime }} - {{ recommendation.sleep.wakeTime }}</span
        >
      </div>
    </div>

    <div class="timeline-content">
      <!-- Sleep -->
      <RecommendationCard
        title="Sleep Schedule"
        icon="😴"
        color="blue"
        :items="[
          `Bedtime: ${recommendation.sleep.bedtime}`,
          `Wake time: ${recommendation.sleep.wakeTime}`,
          `Duration: ${recommendation.sleep.duration} hours`,
        ]"
        :notes="recommendation.sleep.notes"
      />

      <!-- Light Exposure -->
      <RecommendationCard
        v-if="recommendation.lightExposure.length > 0"
        title="Light Exposure"
        icon="🌞"
        color="yellow"
        :items="formatTimeWindows(recommendation.lightExposure)"
        description="Seek bright light during these times to help shift your circadian rhythm."
      />

      <!-- Light Avoidance -->
      <RecommendationCard
        v-if="recommendation.lightAvoidance.length > 0"
        title="Avoid Light"
        icon="🌑"
        color="gray"
        :items="formatTimeWindows(recommendation.lightAvoidance)"
        description="Minimize light exposure, especially blue light from screens. Wear sunglasses if outdoors."
      />

      <!-- Exercise -->
      <RecommendationCard
        v-if="recommendation.exercise"
        title="Exercise"
        icon="🏃"
        color="green"
        :items="[
          `Timing: ${recommendation.exercise.timing.start} - ${recommendation.exercise.timing.end}`,
          `Intensity: ${capitalizeFirst(recommendation.exercise.intensity)}`,
        ]"
        :notes="recommendation.exercise.notes"
      />

      <!-- Caffeine -->
      <RecommendationCard
        v-if="recommendation.caffeine"
        title="Caffeine"
        icon="☕"
        color="brown"
        :items="[`Avoid after: ${recommendation.caffeine.allowedUntil}`]"
        :description="recommendation.caffeine.recommendations"
      />

      <!-- Melatonin -->
      <RecommendationCard
        v-if="recommendation.melatonin"
        title="Melatonin"
        icon="💊"
        color="purple"
        :items="[
          `Take at: ${recommendation.melatonin.timing}`,
          ...(recommendation.melatonin.dosage ? [`Dosage: ${recommendation.melatonin.dosage}`] : []),
        ]"
        :notes="recommendation.melatonin.notes"
      />

      <!-- Meals -->
      <RecommendationCard
        v-if="recommendation.meals"
        title="Meal Timing"
        icon="🍽️"
        color="orange"
        :items="formatMeals(recommendation.meals)"
        :notes="recommendation.meals.notes"
      />

      <!-- General Notes -->
      <div v-if="recommendation.generalNotes && recommendation.generalNotes.length > 0" class="general-notes">
        <h4 class="notes-title">💡 Additional Tips</h4>
        <ul class="notes-list">
          <li v-for="(note, index) in recommendation.generalNotes" :key="index">{{ note }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DailyRecommendation, TimeWindow } from '~/types/travel'
import { formatDateReadable } from '~/utils/dateTimeUtils'
import RecommendationCard from './RecommendationCard.vue'

const props = defineProps<{
  recommendation: DailyRecommendation
  timezone: string
  phase: 'pre-travel' | 'post-arrival'
}>()

const formatDateLabel = computed(() => {
  const date = new Date(props.recommendation.date)
  const formatted = formatDateReadable(date)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  return `${dayName}, ${formatted}`
})

function formatTimeWindows(windows: TimeWindow[]): string[] {
  return windows.map((window) => {
    const priorityLabel = window.priority === 'critical' ? ' (Critical)' : ''
    return `${window.start} - ${window.end}${priorityLabel}`
  })
}

function formatMeals(meals: {
  breakfast?: string
  lunch?: string
  dinner?: string
  notes?: string
}): string[] {
  const items: string[] = []
  if (meals.breakfast) items.push(`Breakfast: ${meals.breakfast}`)
  if (meals.lunch) items.push(`Lunch: ${meals.lunch}`)
  if (meals.dinner) items.push(`Dinner: ${meals.dinner}`)
  return items
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
.daily-timeline {
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-bottom: 2px solid #d1d5db;
  flex-wrap: wrap;
  gap: 1rem;
}

.timeline-date {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6366f1;
  background-color: #eef2ff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #c7d2fe;
}

.date-label {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.sleep-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  background-color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
}

.sleep-icon {
  font-size: 1.25rem;
}

.timeline-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.general-notes {
  margin-top: 0.5rem;
  padding: 1rem;
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.5rem;
}

.notes-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
}

.notes-list {
  list-style: disc;
  padding-left: 1.5rem;
  color: #78350f;
  font-size: 0.875rem;
  line-height: 1.6;
}

.notes-list li {
  margin-bottom: 0.25rem;
}

@media (max-width: 640px) {
  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .timeline-date {
    width: 100%;
  }

  .sleep-summary {
    width: 100%;
    justify-content: center;
  }

  .timeline-content {
    padding: 1rem;
  }
}

@media print {
  .daily-timeline {
    box-shadow: none;
    page-break-inside: avoid;
    margin-bottom: 1rem;
  }
}
</style>

