<template>
  <form
    class="max-w-3xl mx-auto px-4 py-8"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Plan Your Journey
      </h2>
      <p class="text-lg text-gray-600">
        Enter your travel details to get personalized recommendations for minimizing jet lag.
      </p>
    </div>

    <!-- Timezone Selection Section -->
    <section class="mb-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        Where are you traveling?
      </h3>

      <TimezoneSelector
        id="home-timezone"
        label="Your Current Location"
        :model-value="travelForm.formData.homeTimezone"
        placeholder="Select your home timezone"
        :error="showError('homeTimezone') ? travelForm.errors.homeTimezone : undefined"
        help-text="We've auto-detected your timezone, but you can change it if needed."
        required
        @update:model-value="(value) => travelForm.updateField('homeTimezone', value)"
        @blur="() => travelForm.markFieldTouched('homeTimezone')"
      />

      <TimezoneSelector
        id="destination-timezone"
        label="Your Destination"
        :model-value="travelForm.formData.destinationTimezone"
        placeholder="Select your destination timezone"
        :error="
          showError('destinationTimezone') ? travelForm.errors.destinationTimezone : undefined
        "
        help-text="Choose the timezone where you'll be spending most of your time."
        required
        @update:model-value="(value) => travelForm.updateField('destinationTimezone', value)"
        @blur="() => travelForm.markFieldTouched('destinationTimezone')"
      />

      <!-- Timezone Info Display -->
      <div
        v-if="showTimezoneInfo"
        class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span class="text-3xl">{{ directionIcon }}</span>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">
              Travel Direction
            </p>
            <p class="text-lg font-semibold text-gray-900">
              {{ directionText }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span class="text-3xl">🕐</span>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">
              Time Difference
            </p>
            <p class="text-lg font-semibold text-gray-900">
              {{ timeDifferenceText }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Travel Details Section -->
    <section class="mb-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        When are you traveling?
      </h3>

      <DateTimePicker
        id="departure"
        label="Departure Date & Time"
        :date-value="travelForm.formData.departureDate"
        :time-value="travelForm.formData.departureTime"
        :include-time="true"
        :error="showError('departureDate') ? travelForm.errors.departureDate : undefined"
        help-text="Local time at your departure location"
        required
        @update:date-value="(value) => travelForm.updateField('departureDate', value)"
        @update:time-value="(value) => travelForm.updateField('departureTime', value)"
        @blur="() => travelForm.markFieldTouched('departureDate')"
      />
    </section>

    <!-- Sleep Schedule Section -->
    <section class="mb-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <SleepScheduleInput
        id="sleep-schedule"
        :bedtime="travelForm.formData.currentBedtime"
        :wake-time="travelForm.formData.currentWakeTime"
        :bedtime-error="showError('currentBedtime') ? travelForm.errors.currentBedtime : undefined"
        :wake-time-error="
          showError('currentWakeTime') ? travelForm.errors.currentWakeTime : undefined
        "
        @update:bedtime="(value) => travelForm.updateField('currentBedtime', value)"
        @update:wake-time="(value) => travelForm.updateField('currentWakeTime', value)"
        @blur="
          (field) =>
            travelForm.markFieldTouched(field === 'bedtime' ? 'currentBedtime' : 'currentWakeTime')
        "
      />
    </section>

    <!-- Form Actions -->
    <div class="flex justify-between gap-4 mt-8 items-center max-[560px]:flex-col-reverse max-[560px]:items-stretch">
      <button
        type="button"
        class="px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer border-none bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        @click="handleReset"
      >
        Reset Form
      </button>
      <button
        type="submit"
        class="px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer border-none bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        :disabled="!canSubmit"
      >
        Generate My Plan
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTravelForm } from '~/composables/useTravelForm'
import TimezoneSelector from './TimezoneSelector.vue'
import DateTimePicker from './DateTimePicker.vue'
import SleepScheduleInput from './SleepScheduleInput.vue'

const router = useRouter()
const travelForm = useTravelForm()

const showTimezoneInfo = computed(() => {
  return (
    travelForm.formData.homeTimezone
    && travelForm.formData.destinationTimezone
    && travelForm.formData.homeTimezone !== travelForm.formData.destinationTimezone
    && travelForm.timezoneOffset !== 0
  )
})

const directionIcon = computed(() => {
  return travelForm.travelDirection === 'east' ? '➡️' : '⬅️'
})

const directionText = computed(() => {
  return travelForm.travelDirection === 'east' ? 'Traveling Eastward' : 'Traveling Westward'
})

const timeDifferenceText = computed(() => {
  const offset = Math.abs(travelForm.timezoneOffset)
  const hours = Math.floor(offset)
  const minutes = Math.round((offset - hours) * 60)

  if (minutes === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }

  return `${hours}h ${minutes}m`
})

const canSubmit = computed(() => {
  const hasActualErrors = Object.values(travelForm.errors).some(error => error !== undefined)
  return (
    travelForm.formData.homeTimezone !== ''
    && travelForm.formData.destinationTimezone !== ''
    && travelForm.formData.departureDate !== ''
    && !hasActualErrors
  )
})

function showError(field: keyof typeof travelForm.formData): boolean {
  return !!(travelForm.touched[field] && travelForm.errors[field])
}

async function handleSubmit() {
  if (travelForm.validateForm()) {
    router.push({ name: 'plan-results', query: travelForm.formData })
  }
}

function handleReset() {
  if (confirm('Are you sure you want to reset the form? All your entries will be lost.')) {
    travelForm.resetForm()
  }
}
</script>
