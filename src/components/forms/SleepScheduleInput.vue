<template>
  <div class="sleep-schedule-input">
    <h3 class="section-title">Your Current Sleep Schedule</h3>
    <p class="section-description">
      This helps us create personalized recommendations for adapting to your destination timezone.
    </p>

    <div class="sleep-inputs">
      <div class="form-field">
        <label :for="`${id}-bedtime`" class="form-label">
          Usual Bedtime
          <span class="text-red-500">*</span>
        </label>
        <input
          :id="`${id}-bedtime`"
          type="time"
          :value="bedtime"
          @input="handleBedtimeChange"
          @blur="() => emit('blur', 'bedtime')"
          class="form-input"
          :class="{ 'form-input-error': bedtimeError }"
          :aria-describedby="bedtimeError ? `${id}-bedtime-error` : undefined"
          :aria-invalid="!!bedtimeError"
        />
        <p v-if="bedtimeError" :id="`${id}-bedtime-error`" class="form-error">
          {{ bedtimeError }}
        </p>
      </div>

      <div class="form-field">
        <label :for="`${id}-waketime`" class="form-label">
          Usual Wake Time
          <span class="text-red-500">*</span>
        </label>
        <input
          :id="`${id}-waketime`"
          type="time"
          :value="wakeTime"
          @input="handleWakeTimeChange"
          @blur="() => emit('blur', 'wakeTime')"
          class="form-input"
          :class="{ 'form-input-error': wakeTimeError }"
          :aria-describedby="wakeTimeError ? `${id}-waketime-error` : undefined"
          :aria-invalid="!!wakeTimeError"
        />
        <p v-if="wakeTimeError" :id="`${id}-waketime-error`" class="form-error">
          {{ wakeTimeError }}
        </p>
      </div>
    </div>

    <div v-if="sleepDuration" class="sleep-summary">
      <div class="sleep-summary-content">
        <span class="sleep-icon">😴</span>
        <div>
          <p class="sleep-summary-label">Sleep Duration</p>
          <p class="sleep-summary-value">{{ formatDuration(sleepDuration) }}</p>
        </div>
      </div>
      <p v-if="sleepWarning" class="sleep-warning">
        {{ sleepWarning }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { calculateSleepDuration } from '@/services/dateTimeUtils'

interface Props {
  id: string
  bedtime: string
  wakeTime: string
  bedtimeError?: string
  wakeTimeError?: string
}

interface Emits {
  (e: 'update:bedtime', value: string): void
  (e: 'update:wakeTime', value: string): void
  (e: 'blur', field: 'bedtime' | 'wakeTime'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const sleepDuration = computed(() => {
  if (!props.bedtime || !props.wakeTime) return null
  return calculateSleepDuration(props.bedtime, props.wakeTime)
})

const sleepWarning = computed(() => {
  if (!sleepDuration.value) return null

  if (sleepDuration.value < 4) {
    return '⚠️ This seems very short. Most adults need 7-9 hours of sleep.'
  }
  if (sleepDuration.value < 6) {
    return 'This is shorter than recommended. Consider if this is typical for you.'
  }
  if (sleepDuration.value > 10) {
    return 'This is longer than average. Ensure this reflects your typical schedule.'
  }
  if (sleepDuration.value >= 7 && sleepDuration.value <= 9) {
    return '✅ This is within the recommended range for most adults.'
  }
  return null
})

function formatDuration(hours: number): string {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)

  if (minutes === 0) {
    return `${wholeHours} hour${wholeHours === 1 ? '' : 's'}`
  }

  return `${wholeHours} hour${wholeHours === 1 ? '' : 's'} ${minutes} min`
}

function handleBedtimeChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:bedtime', target.value)
}

function handleWakeTimeChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:wakeTime', target.value)
}
</script>

<style scoped>
.sleep-schedule-input > * + * {
  margin-top: 1rem; /* space-y-4 => 1rem gap between direct children */
}

.section-title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600;
  color: #111827; /* gray-900 */
}

.section-description {
  font-size: 0.875rem; /* text-sm */
  color: #4b5563; /* gray-600 */
}

.sleep-inputs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; /* gap-4 */
}

@media (min-width: 768px) {
  .sleep-inputs {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-field {
  margin-bottom: 0; /* mb-0 */
}

.form-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #374151; /* gray-700 */
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03); /* shadow-sm */
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.form-input-error {
  border-color: #ef4444; /* red-500 */
}

.form-error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626; /* red-600 */
}

.sleep-summary {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #eff6ff; /* blue-50 */
  border: 1px solid #bfdbfe; /* blue-200 */
  border-radius: 0.5rem;
}

.sleep-summary-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sleep-icon {
  font-size: 1.875rem; /* text-3xl */
}

.sleep-summary-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.sleep-summary-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d4ed8; /* blue-700 */
}

.sleep-warning {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}
</style>
