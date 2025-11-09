<template>
  <div class="overview-card">
    <div class="card-header">
      <h2 class="card-title">Trip Overview</h2>
      <div :class="['difficulty-badge', difficultyClass]">
        {{ difficultyLabel }}
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">🏠</div>
        <div class="stat-content">
          <p class="stat-label">From</p>
          <p class="stat-value">{{ formatTimezone(plan.homeTimezone) }}</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">🌍</div>
        <div class="stat-content">
          <p class="stat-label">To</p>
          <p class="stat-value">{{ formatTimezone(plan.destinationTimezone) }}</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">{{ directionIcon }}</div>
        <div class="stat-content">
          <p class="stat-label">Direction</p>
          <p class="stat-value">{{ directionText }}</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">🕐</div>
        <div class="stat-content">
          <p class="stat-label">Time Difference</p>
          <p class="stat-value">{{ timeDifferenceText }}</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <p class="stat-label">Departure</p>
          <p class="stat-value">{{ formatDepartureDate }}</p>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">⏱️</div>
        <div class="stat-content">
          <p class="stat-label">Estimated Adjustment</p>
          <p class="stat-value">{{ adjustmentText }}</p>
        </div>
      </div>
    </div>

    <div class="info-box">
      <div class="info-icon">💡</div>
      <div class="info-content">
        <p class="info-title">Key Insight</p>
        <p class="info-text">{{ keyInsight }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TravelPlan } from '~/types/travel'
import { formatDateReadable } from '~/utils/dateTimeUtils'

const props = defineProps<{
  plan: TravelPlan
}>()

const directionIcon = computed(() => {
  return props.plan.travelDirection === 'east' ? '➡️' : '⬅️'
})

const directionText = computed(() => {
  return props.plan.travelDirection === 'east' ? 'Eastward' : 'Westward'
})

const timeDifferenceText = computed(() => {
  const offset = Math.abs(props.plan.timezoneOffset)
  const hours = Math.floor(offset)
  const minutes = Math.round((offset - hours) * 60)

  if (minutes === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }

  return `${hours}h ${minutes}m`
})

const adjustmentText = computed(() => {
  const days = props.plan.adjustmentDays
  return `${days} day${days === 1 ? '' : 's'}`
})

const formatDepartureDate = computed(() => {
  return formatDateReadable(props.plan.departureDate)
})

const difficultyLevel = computed(() => {
  const offset = Math.abs(props.plan.timezoneOffset)
  const isEast = props.plan.travelDirection === 'east'

  if (offset <= 2) return 'easy'
  if (offset <= 4) return isEast ? 'moderate' : 'easy'
  if (offset <= 6) return isEast ? 'hard' : 'moderate'
  return isEast ? 'very-hard' : 'hard'
})

const difficultyClass = computed(() => {
  return `difficulty-${difficultyLevel.value}`
})

const difficultyLabel = computed(() => {
  const labels = {
    easy: 'Easy Adjustment',
    moderate: 'Moderate Adjustment',
    hard: 'Challenging Adjustment',
    'very-hard': 'Very Challenging',
  }
  return labels[difficultyLevel.value as keyof typeof labels]
})

const keyInsight = computed(() => {
  const isEast = props.plan.travelDirection === 'east'
  const offset = Math.abs(props.plan.timezoneOffset)

  if (offset <= 2) {
    return 'Your time difference is small. Focus on staying hydrated and maintaining your sleep schedule on arrival.'
  }

  if (isEast) {
    return 'Eastward travel is more challenging as you need to advance your internal clock. Morning light exposure at your destination will be crucial.'
  }

  return 'Westward travel is generally easier to adapt to. Evening light exposure at your destination will help delay your internal clock.'
})

function formatTimezone(tz: string): string {
  // Extract city name from timezone string (e.g., "America/New_York" -> "New York")
  const parts = tz.split('/')
  const city = parts[parts.length - 1]
  return city ? city.replace(/_/g, ' ') : tz
}
</script>

<style scoped>
.overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 2rem;
  color: #ffffff;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.difficulty-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.difficulty-easy {
  background-color: rgba(34, 197, 94, 0.3);
  border: 1px solid rgba(34, 197, 94, 0.5);
}

.difficulty-moderate {
  background-color: rgba(251, 191, 36, 0.3);
  border: 1px solid rgba(251, 191, 36, 0.5);
}

.difficulty-hard {
  background-color: rgba(249, 115, 22, 0.3);
  border: 1px solid rgba(249, 115, 22, 0.5);
}

.difficulty-very-hard {
  background-color: rgba(239, 68, 68, 0.3);
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-box {
  display: flex;
  gap: 1rem;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-text {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.95;
}

@media (max-width: 640px) {
  .overview-card {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .card-title {
    font-size: 1.25rem;
  }
}

@media print {
  .overview-card {
    background: #f3f4f6;
    color: #111827;
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }

  .stat-item,
  .info-box {
    background-color: #ffffff;
    border-color: #d1d5db;
  }

  .stat-label,
  .info-title {
    color: #6b7280;
  }

  .stat-value,
  .info-text {
    color: #111827;
  }
}
</style>

