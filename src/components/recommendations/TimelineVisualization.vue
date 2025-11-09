<template>
  <div class="timeline-visualization">
    <div class="timeline-header">
      <h3 class="timeline-title">
        <span class="timeline-icon">📅</span>
        Visual Timeline
      </h3>
      <p class="timeline-subtitle">Your complete adaptation schedule at a glance</p>
    </div>


    <!-- Legend -->
    <div class="timeline-legend">
      <div v-for="item in legendItems" :key="item.key" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- Timeline Grid -->
    <div class="timeline-container">
      <div class="timeline-grid">
        <!-- Time axis (left column) -->
        <div class="time-axis">
          <div class="axis-header">Time</div>
          <div v-for="hour in hours" :key="hour" class="time-label">
            {{ formatHour(hour) }}
          </div>
        </div>

        <!-- Day columns -->
        <div
          v-for="day in allDays"
          :key="day.date.toISOString()"
          :class="['day-column', { 'is-today': isToday(day), 'is-travel-day': isTravelDay(day) }]"
        >
          <!-- Day header -->
          <div class="day-header">
            <div class="day-date">{{ formatDayHeader(day) }}</div>
            <div class="day-label">{{ getDayLabel(day) }}</div>
          </div>

          <!-- Activity blocks -->
          <div class="activity-blocks">
            <!-- Sleep blocks -->
            <div
              v-for="(block, blockIndex) in day.sleepBlocks"
              :key="`sleep-${blockIndex}`"
              :class="['activity-block', 'activity-sleep']"
              :style="getBlockStyle(block)"
              :title="`Sleep: ${block.start} - ${block.end}`"
            >
              <span class="block-icon">😴</span>
              <span class="block-label">Sleep</span>
            </div>

            <!-- Light exposure blocks -->
            <div
              v-for="(block, blockIndex) in day.lightExposureBlocks"
              :key="`light-${blockIndex}`"
              :class="['activity-block', 'activity-light-exposure', `priority-${block.priority}`]"
              :style="getBlockStyle(block)"
              :title="`Light Exposure: ${block.start} - ${block.end}`"
            >
              <span class="block-icon">🌞</span>
              <span v-if="block.priority === 'critical'" class="priority-badge">!</span>
            </div>

            <!-- Light avoidance blocks -->
            <div
              v-for="(block, blockIndex) in day.lightAvoidanceBlocks"
              :key="`avoid-${blockIndex}`"
              :class="['activity-block', 'activity-light-avoidance']"
              :style="getBlockStyle(block)"
              :title="`Avoid Light: ${block.start} - ${block.end}`"
            >
              <span class="block-icon">🌑</span>
            </div>

            <!-- Exercise blocks -->
            <div
              v-for="(block, blockIndex) in day.exerciseBlocks"
              :key="`exercise-${blockIndex}`"
              :class="['activity-block', 'activity-exercise']"
              :style="getBlockStyle(block)"
              :title="`Exercise: ${block.start} - ${block.end}`"
            >
              <span class="block-icon">🏃</span>
            </div>

            <!-- Melatonin markers -->
            <div
              v-for="(marker, markerIndex) in day.melatoninMarkers"
              :key="`melatonin-${markerIndex}`"
              class="time-marker melatonin-marker"
              :style="getMarkerStyle(marker)"
              :title="`Melatonin: ${marker.time}`"
            >
              💊
            </div>

            <!-- Caffeine cutoff markers -->
            <div
              v-for="(marker, markerIndex) in day.caffeineCutoffMarkers"
              :key="`caffeine-${markerIndex}`"
              class="time-marker caffeine-marker"
              :style="getMarkerStyle(marker)"
              :title="`Caffeine cutoff: ${marker.time}`"
            >
              ☕
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current time indicator (if plan is active) -->
    <div v-if="showCurrentTimeIndicator" class="current-time-indicator" :style="currentTimeStyle">
      <div class="current-time-line"></div>
      <div class="current-time-label">Now</div>
    </div>

    <!-- Mobile view hint -->
    <div class="mobile-hint">
      <span class="hint-icon">👈</span>
      Swipe to see more days
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TravelPlan, DailyRecommendation } from '@/types/travel'

const props = defineProps<{
  plan: TravelPlan
}>()

interface TimeBlock {
  start: string
  end: string
  priority?: 'critical' | 'recommended' | 'optional'
}

interface TimeMarker {
  time: string
}

interface DayData {
  date: Date
  recommendation: DailyRecommendation | null
  phase: 'pre-travel' | 'travel' | 'post-arrival'
  sleepBlocks: TimeBlock[]
  lightExposureBlocks: TimeBlock[]
  lightAvoidanceBlocks: TimeBlock[]
  exerciseBlocks: TimeBlock[]
  melatoninMarkers: TimeMarker[]
  caffeineCutoffMarkers: TimeMarker[]
}


const legendItems = [
  { key: 'sleep', label: 'Sleep', color: '#3b82f6' },
  { key: 'light', label: 'Light Exposure', color: '#fbbf24' },
  { key: 'avoid', label: 'Avoid Light', color: '#6b7280' },
  { key: 'exercise', label: 'Exercise', color: '#10b981' },
  { key: 'melatonin', label: 'Melatonin', color: '#8b5cf6' },
  { key: 'caffeine', label: 'Caffeine Cutoff', color: '#92400e' },
]

const hours = Array.from({ length: 24 }, (_, i) => i)

// Build complete day data including all phases
const allDays = computed<DayData[]>(() => {
  const days: DayData[] = []

  // Pre-travel days
  props.plan.preTravel.forEach((rec) => {
    days.push(buildDayData(rec, 'pre-travel'))
  })

  // Travel day
  const travelDayData: DayData = {
    date: props.plan.travelDay.date,
    recommendation: null,
    phase: 'travel',
    sleepBlocks: [],
    lightExposureBlocks: [],
    lightAvoidanceBlocks: [],
    exerciseBlocks: [],
    melatoninMarkers: [],
    caffeineCutoffMarkers: [],
  }
  days.push(travelDayData)

  // Post-arrival days
  props.plan.postArrival.forEach((rec) => {
    days.push(buildDayData(rec, 'post-arrival'))
  })

  return days
})


// Check if today is within the plan dates
const showCurrentTimeIndicator = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(props.plan.departureDate)
  startDate.setDate(startDate.getDate() - props.plan.preTravel.length)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(props.plan.departureDate)
  endDate.setDate(endDate.getDate() + props.plan.postArrival.length)
  endDate.setHours(0, 0, 0, 0)
  return today >= startDate && today <= endDate
})

const currentTimeStyle = computed(() => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const totalMinutes = hours * 60 + minutes
  const percentage = (totalMinutes / (24 * 60)) * 100
  return {
    top: `${percentage}%`,
  }
})

function buildDayData(
  recommendation: DailyRecommendation,
  phase: 'pre-travel' | 'post-arrival',
): DayData {
  return {
    date: recommendation.date,
    recommendation,
    phase,
    sleepBlocks: [
      {
        start: recommendation.sleep.bedtime,
        end: recommendation.sleep.wakeTime,
      },
    ],
    lightExposureBlocks: recommendation.lightExposure.map((w) => ({
      start: w.start,
      end: w.end,
      priority: w.priority,
    })),
    lightAvoidanceBlocks: recommendation.lightAvoidance.map((w) => ({
      start: w.start,
      end: w.end,
    })),
    exerciseBlocks: recommendation.exercise
      ? [
          {
            start: recommendation.exercise.timing.start,
            end: recommendation.exercise.timing.end,
          },
        ]
      : [],
    melatoninMarkers: recommendation.melatonin
      ? [{ time: recommendation.melatonin.timing }]
      : [],
    caffeineCutoffMarkers: recommendation.caffeine
      ? [{ time: recommendation.caffeine.allowedUntil }]
      : [],
  }
}

function formatHour(hour: number): string {
  if (hour === 0) return '12am'
  if (hour === 12) return '12pm'
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`
}

function formatDayHeader(day: DayData): string {
  const date = new Date(day.date)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDayLabel(day: DayData): string {
  if (day.phase === 'travel') return 'Travel Day'
  if (day.phase === 'pre-travel' && day.recommendation) {
    return `Day ${day.recommendation.dayNumber}`
  }
  if (day.phase === 'post-arrival' && day.recommendation) {
    return `Day ${day.recommendation.dayNumber}`
  }
  return ''
}

function isToday(day: DayData): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayDate = new Date(day.date)
  dayDate.setHours(0, 0, 0, 0)
  return today.getTime() === dayDate.getTime()
}

function isTravelDay(day: DayData): boolean {
  return day.phase === 'travel'
}

function getBlockStyle(block: TimeBlock): Record<string, string> {
  const start = parseTime(block.start)
  const end = parseTime(block.end)

  let startMinutes = start.hours * 60 + start.minutes
  let endMinutes = end.hours * 60 + end.minutes

  // Handle overnight blocks
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60
  }

  const top = (startMinutes / (24 * 60)) * 100
  const height = ((endMinutes - startMinutes) / (24 * 60)) * 100

  return {
    top: `${top}%`,
    height: `${height}%`,
  }
}

function getMarkerStyle(marker: TimeMarker): Record<string, string> {
  const time = parseTime(marker.time)
  const minutes = time.hours * 60 + time.minutes
  const top = (minutes / (24 * 60)) * 100

  return {
    top: `${top}%`,
  }
}

function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours = 0, minutes = 0] = timeString.split(':').map(Number)
  return { hours, minutes }
}
</script>

<style scoped>
.timeline-visualization {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.timeline-header {
  margin-bottom: 1.5rem;
}

.timeline-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.timeline-icon {
  font-size: 1.75rem;
}

.timeline-subtitle {
  font-size: 1rem;
  color: #6b7280;
}


.timeline-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.legend-color {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
}

.timeline-container {
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fafafa;
}

.timeline-grid {
  display: flex;
  min-width: min-content;
}

.time-axis {
  position: sticky;
  left: 0;
  z-index: 10;
  background-color: #ffffff;
  border-right: 2px solid #e5e7eb;
  min-width: 4rem;
}

.axis-header {
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.time-label {
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
}

.day-column {
  min-width: 10rem;
  border-right: 1px solid #e5e7eb;
  position: relative;
}

.day-column.is-today {
  background-color: #eff6ff;
}

.day-column.is-travel-day {
  background-color: #fff7ed;
}

.day-header {
  height: 5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;
  text-align: center;
}

.day-date {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.day-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.activity-blocks {
  position: relative;
  height: calc(24 * 3rem);
}

.activity-block {
  position: absolute;
  left: 0.25rem;
  right: 0.25rem;
  border-radius: 0.25rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.2s ease;
  border: 1px solid;
}

.activity-block:hover {
  opacity: 1;
  z-index: 5;
}

.block-icon {
  font-size: 1rem;
}

.block-label {
  display: none;
}

@media (min-width: 768px) {
  .day-column {
    min-width: 12rem;
  }

  .block-label {
    display: inline;
  }
}

.activity-sleep {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #1e40af;
}

.activity-light-exposure {
  background-color: rgba(251, 191, 36, 0.2);
  border-color: #fbbf24;
  color: #92400e;
}

.activity-light-exposure.priority-critical {
  background-color: rgba(251, 191, 36, 0.4);
  border-width: 2px;
  border-color: #f59e0b;
}

.activity-light-avoidance {
  background-color: rgba(107, 114, 128, 0.2);
  border-color: #6b7280;
  color: #374151;
}

.activity-exercise {
  background-color: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #065f46;
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  background-color: #ef4444;
  color: #ffffff;
  border-radius: 50%;
  font-size: 0.625rem;
  font-weight: 700;
}

.time-marker {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 1.25rem;
  z-index: 5;
}

.melatonin-marker {
  border: 2px solid #8b5cf6;
}

.caffeine-marker {
  border: 2px solid #92400e;
}

.current-time-indicator {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 20;
  pointer-events: none;
}

.current-time-line {
  height: 2px;
  background-color: #ef4444;
  box-shadow: 0 0 4px rgba(239, 68, 68, 0.5);
}

.current-time-label {
  position: absolute;
  left: 4.5rem;
  top: -0.75rem;
  background-color: #ef4444;
  color: #ffffff;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.mobile-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  color: #1e40af;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .mobile-hint {
    display: none;
  }
}

.hint-icon {
  font-size: 1.25rem;
}

@media print {
  .mobile-hint {
    display: none;
  }

  .timeline-container {
    overflow: visible;
  }

  .timeline-grid {
    display: flex;
  }
}
</style>

