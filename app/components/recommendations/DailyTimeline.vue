<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
    <div class="flex justify-between items-center p-5 bg-gradient-to-br from-gray-100 to-gray-200 border-b-2 border-gray-300 flex-wrap gap-4 max-sm:flex-col max-sm:items-start">
      <div class="flex items-center gap-4 w-full">
        <div class="text-sm font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
          <span v-if="phase === 'pre-travel'">Day {{ Math.abs(recommendation.dayNumber) }}</span>
          <span v-else>Day {{ recommendation.dayNumber }}</span>
        </div>
        <div class="text-base font-semibold text-gray-900">
          {{ formatDateLabel }}
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-300 w-full justify-center max-sm:w-full">
        <span class="text-xl">😴</span>
        <span>{{ recommendation.sleep.bedtime }} - {{ recommendation.sleep.wakeTime }}</span>
      </div>
    </div>

    <div class="p-6 flex flex-col gap-4 max-sm:p-4">
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
      <div
        v-if="recommendation.generalNotes && recommendation.generalNotes.length > 0"
        class="mt-2 p-4 bg-yellow-100 border border-yellow-400 rounded-lg"
      >
        <h4 class="text-sm font-semibold text-yellow-900 mb-2">
          💡 Additional Tips
        </h4>
        <ul class="list-disc pl-6 text-yellow-800 text-sm leading-relaxed">
          <li
            v-for="(note, index) in recommendation.generalNotes"
            :key="index"
            class="mb-1"
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
