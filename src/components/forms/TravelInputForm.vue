<template>
  <form @submit.prevent="handleSubmit" class="travel-input-form" novalidate>
    <div class="form-header">
      <h2 class="form-title">Plan Your Journey</h2>
      <p class="form-subtitle">
        Enter your travel details to get personalized recommendations for minimizing jet lag.
      </p>
    </div>

    <!-- Timezone Selection Section -->
    <section class="form-section">
      <h3 class="section-title">Where are you traveling?</h3>

      <TimezoneSelector
        id="home-timezone"
        label="Your Current Location"
        :model-value="travelStore.formData.homeTimezone"
        placeholder="Select your home timezone"
        :error="showError('homeTimezone') ? travelStore.errors.homeTimezone : undefined"
        help-text="We've auto-detected your timezone, but you can change it if needed."
        required
        @update:model-value="(value) => travelStore.updateField('homeTimezone', value)"
        @blur="() => travelStore.markFieldTouched('homeTimezone')"
      />

      <TimezoneSelector
        id="destination-timezone"
        label="Your Destination"
        :model-value="travelStore.formData.destinationTimezone"
        placeholder="Select your destination timezone"
        :error="showError('destinationTimezone') ? travelStore.errors.destinationTimezone : undefined"
        help-text="Choose the timezone where you'll be spending most of your time."
        required
        @update:model-value="(value) => travelStore.updateField('destinationTimezone', value)"
        @blur="() => travelStore.markFieldTouched('destinationTimezone')"
      />

      <!-- Timezone Info Display -->
      <div v-if="showTimezoneInfo" class="timezone-info">
        <div class="info-card">
          <span class="info-icon">{{ directionIcon }}</span>
          <div class="info-content">
            <p class="info-label">Travel Direction</p>
            <p class="info-value">{{ directionText }}</p>
          </div>
        </div>
        <div class="info-card">
          <span class="info-icon">🕐</span>
          <div class="info-content">
            <p class="info-label">Time Difference</p>
            <p class="info-value">{{ timeDifferenceText }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Travel Details Section -->
    <section class="form-section">
      <h3 class="section-title">When are you traveling?</h3>

      <DateTimePicker
        id="departure"
        label="Departure Date & Time"
        :date-value="travelStore.formData.departureDate"
        :time-value="travelStore.formData.departureTime"
        :include-time="true"
        :error="showError('departureDate') ? travelStore.errors.departureDate : undefined"
        help-text="Local time at your departure location"
        required
        @update:date-value="(value) => travelStore.updateField('departureDate', value)"
        @update:time-value="(value) => travelStore.updateField('departureTime', value)"
        @blur="() => travelStore.markFieldTouched('departureDate')"
      />

      <div class="form-field">
        <label for="days-at-destination" class="form-label">
          Days at Destination
          <span class="text-red-500">*</span>
        </label>
        <input
          id="days-at-destination"
          type="number"
          min="1"
          max="365"
          :value="travelStore.formData.daysAtDestination"
          @input="handleDaysChange"
          @blur="() => travelStore.markFieldTouched('daysAtDestination')"
          class="form-input"
          :class="{ 'form-input-error': showError('daysAtDestination') }"
          :aria-describedby="showError('daysAtDestination') ? 'days-error' : undefined"
          :aria-invalid="showError('daysAtDestination')"
        />
        <p v-if="showError('daysAtDestination')" id="days-error" class="form-error">
          {{ travelStore.errors.daysAtDestination }}
        </p>
        <p v-else class="form-help">
          How many days will you spend at your destination?
        </p>
      </div>
    </section>

    <!-- Sleep Schedule Section -->
    <section class="form-section">
      <SleepScheduleInput
        id="sleep-schedule"
        :bedtime="travelStore.formData.currentBedtime"
        :wake-time="travelStore.formData.currentWakeTime"
        :bedtime-error="showError('currentBedtime') ? travelStore.errors.currentBedtime : undefined"
        :wake-time-error="showError('currentWakeTime') ? travelStore.errors.currentWakeTime : undefined"
        @update:bedtime="(value) => travelStore.updateField('currentBedtime', value)"
        @update:wake-time="(value) => travelStore.updateField('currentWakeTime', value)"
        @blur="(field) => travelStore.markFieldTouched(field === 'bedtime' ? 'currentBedtime' : 'currentWakeTime')"
      />
    </section>

    <!-- Form Actions -->
    <div class="form-actions">
      <button
        type="button"
        @click="handleReset"
        class="btn btn-secondary"
      >
        Reset Form
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="!canSubmit"
      >
        Generate My Plan
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTravelStore } from '@/stores/travelStore'
import TimezoneSelector from './TimezoneSelector.vue'
import DateTimePicker from './DateTimePicker.vue'
import SleepScheduleInput from './SleepScheduleInput.vue'

const travelStore = useTravelStore()

const showTimezoneInfo = computed(() => {
  return travelStore.formData.homeTimezone &&
         travelStore.formData.destinationTimezone &&
         travelStore.formData.homeTimezone !== travelStore.formData.destinationTimezone
})

const directionIcon = computed(() => {
  return travelStore.travelDirection === 'east' ? '➡️' : '⬅️'
})

const directionText = computed(() => {
  return travelStore.travelDirection === 'east' ? 'Traveling Eastward' : 'Traveling Westward'
})

const timeDifferenceText = computed(() => {
  const offset = Math.abs(travelStore.timezoneOffset)
  const hours = Math.floor(offset)
  const minutes = Math.round((offset - hours) * 60)

  if (minutes === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }

  return `${hours}h ${minutes}m`
})

const canSubmit = computed(() => {
  return travelStore.formData.homeTimezone !== '' &&
         travelStore.formData.destinationTimezone !== '' &&
         travelStore.formData.departureDate !== '' &&
         Object.keys(travelStore.errors).length === 0
})

function showError(field: keyof typeof travelStore.formData): boolean {
  return !!(travelStore.touched[field] && travelStore.errors[field])
}

function handleDaysChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = Number.parseInt(target.value, 10)
  travelStore.updateField('daysAtDestination', value || 1)
}

function handleSubmit() {
  if (travelStore.validateForm()) {
    // Phase 1.2 will implement the plan generation and results page
    console.log('Form is valid, ready to generate plan:', travelStore.formData)
  }
}

function handleReset() {
  if (confirm('Are you sure you want to reset the form? All your entries will be lost.')) {
    travelStore.resetForm()
  }
}
</script>

<style scoped>
.travel-input-form {
  /* max-w-3xl mx-auto px-4 py-8 */
  max-width: 48rem; /* 768px */
  margin-left: auto;
  margin-right: auto;
  padding: 2rem 1rem;
}

.form-header {
  /* mb-8 text-center */
  margin-bottom: 2rem;
  text-align: center;
}

.form-title {
  /* text-3xl font-bold text-gray-900 mb-2 */
  font-size: 1.875rem; /* 30px */
  line-height: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  /* text-lg text-gray-600 */
  font-size: 1.125rem; /* 18px */
  color: #4B5563;
}

.form-section {
  /* mb-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200 */
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid #E5E7EB;
}

.section-title {
  /* text-xl font-semibold text-gray-900 mb-4 */
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.timezone-info {
  /* mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 */
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .timezone-info {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-card {
  /* flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 */
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #EFF6FF; /* blue-50 */
  border-radius: 0.5rem;
  border: 1px solid #BFDBFE; /* blue-200 */
}

.info-icon {
  /* text-3xl */
  font-size: 1.875rem;
}

.info-content {
  /* flex-1 */
  flex: 1 1 0%;
}

.info-label {
  /* text-sm font-medium text-gray-600 */
  font-size: 0.875rem;
  font-weight: 500;
  color: #4B5563;
}

.info-value {
  /* text-lg font-semibold text-gray-900 */
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.form-field {
  /* mb-6 */
  margin-bottom: 1.5rem;
}

.form-label {
  /* block text-sm font-medium text-gray-700 mb-2 */
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  /* w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm; focus styles */
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #D1D5DB; /* gray-300 */
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-color: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
}

.form-input-error {
  /* border-red-500 focus:ring-red-500 focus:border-red-500 */
  border-color: #ef4444 !important;
}

.form-input-error:focus {
  box-shadow: 0 0 0 4px rgba(239,68,68,0.08) !important;
}

.form-error {
  /* mt-2 text-sm text-red-600 */
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #DC2626;
}

.form-help {
  /* mt-2 text-sm text-gray-500 */
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6B7280;
}

.form-actions {
  /* flex justify-between gap-4 mt-8 */
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  align-items: center;
}

@media (max-width: 560px) {
  .form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

.btn {
  /* px-6 py-3 rounded-lg font-medium transition-all duration-200; focus styles */
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
}

.btn-primary {
  /* bg-blue-600 text-white hover:bg-blue-700; disabled styles */
  background-color: #2563EB; /* blue-600 */
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1D4ED8; /* blue-700 */
}

.btn-primary:disabled {
  background-color: #D1D5DB;
  cursor: not-allowed;
}

.btn-secondary {
  /* bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 */
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.btn-secondary:hover {
  background-color: #F9FAFB;
}

.btn-secondary:focus {
  box-shadow: 0 0 0 4px rgba(107,114,128,0.08);
}
</style>
