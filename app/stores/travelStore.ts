/**
 * Pinia store for managing travel plan form state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TravelFormData, TravelPlan } from '~/types/travel'
import {
  getCurrentTimezone,
  calculateTimezoneOffset,
  getTravelDirection,
} from '~/utils/timezoneService'
import { calculateSleepDuration, getTodayDate } from '~/utils/dateTimeUtils'
import { generateTravelPlan } from '~/utils/jetlagAlgorithm'

export const useTravelStore = defineStore('travel', () => {
  // Form data
  const formData = ref<TravelFormData>({
    homeTimezone: getCurrentTimezone(),
    destinationTimezone: '',
    departureDate: getTodayDate(),
    departureTime: '09:00',
    currentBedtime: '23:00',
    currentWakeTime: '07:00',
  })

  // Form validation state
  const errors = ref<Partial<Record<keyof TravelFormData, string>>>({})
  const touched = ref<Partial<Record<keyof TravelFormData, boolean>>>({})

  // Generated travel plan
  const travelPlan = ref<TravelPlan | null>(null)
  const isGenerating = ref(false)
  const generationError = ref<string | null>(null)

  // Computed values
  const sleepDuration = computed(() => {
    return calculateSleepDuration(formData.value.currentBedtime, formData.value.currentWakeTime)
  })

  const timezoneOffset = computed(() => {
    if (!formData.value.homeTimezone || !formData.value.destinationTimezone) {
      return 0
    }
    let departureDateTime: Date
    if (formData.value.departureDate && formData.value.departureTime) {
      try {
        departureDateTime = new Date(`${formData.value.departureDate}T${formData.value.departureTime}`)
      }
      catch {
        departureDateTime = new Date()
      }
    }
    else {
      departureDateTime = new Date()
    }
    return calculateTimezoneOffset(formData.value.homeTimezone, formData.value.destinationTimezone, departureDateTime)
  })

  const travelDirection = computed(() => {
    return getTravelDirection(timezoneOffset.value)
  })

  const isFormValid = computed(() => {
    const hasActualErrors = Object.values(errors.value).some(error => error !== undefined)
    return !hasActualErrors && hasRequiredFields()
  })

  // Helper to check if all required fields are filled
  function hasRequiredFields(): boolean {
    return !!(
      formData.value.homeTimezone
      && formData.value.destinationTimezone
      && formData.value.departureDate
      && formData.value.departureTime
      && formData.value.currentBedtime
      && formData.value.currentWakeTime
    )
  }

  // Actions
  function updateField<K extends keyof TravelFormData>(field: K, value: TravelFormData[K]) {
    formData.value[field] = value
    touched.value[field] = true
    validateField(field)
  }

  function validateField(field: keyof TravelFormData) {
    errors.value[field] = undefined

    switch (field) {
      case 'homeTimezone':
        if (!formData.value.homeTimezone) {
          errors.value.homeTimezone = 'Home timezone is required'
        }
        break

      case 'destinationTimezone':
        if (!formData.value.destinationTimezone) {
          errors.value.destinationTimezone = 'Destination timezone is required'
        }
        else if (formData.value.destinationTimezone === formData.value.homeTimezone) {
          errors.value.destinationTimezone = 'Destination must be different from home timezone'
        }
        break

      case 'departureDate':
        if (!formData.value.departureDate) {
          errors.value.departureDate = 'Departure date is required'
        }
        else {
          const departureDate = new Date(formData.value.departureDate)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (departureDate < today) {
            errors.value.departureDate = 'Departure date cannot be in the past'
          }
        }
        break

      case 'departureTime':
        if (!formData.value.departureTime) {
          errors.value.departureTime = 'Departure time is required'
        }
        break

      case 'currentBedtime':
        if (!formData.value.currentBedtime) {
          errors.value.currentBedtime = 'Bedtime is required'
        }
        break

      case 'currentWakeTime':
        if (!formData.value.currentWakeTime) {
          errors.value.currentWakeTime = 'Wake time is required'
        }
        else if (sleepDuration.value < 4) {
          errors.value.currentWakeTime = 'Sleep duration seems too short (less than 4 hours)'
        }
        else if (sleepDuration.value > 14) {
          errors.value.currentWakeTime = 'Sleep duration seems too long (more than 14 hours)'
        }
        break
    }
  }

  function validateForm(): boolean {
    // Mark all fields as touched
    Object.keys(formData.value).forEach((key) => {
      touched.value[key as keyof TravelFormData] = true
      validateField(key as keyof TravelFormData)
    })

    return isFormValid.value
  }

  function resetForm() {
    formData.value = {
      homeTimezone: getCurrentTimezone(),
      destinationTimezone: '',
      departureDate: getTodayDate(),
      departureTime: '09:00',
      currentBedtime: '23:00',
      currentWakeTime: '07:00',
    }
    errors.value = {}
    touched.value = {}
  }

  function markFieldTouched(field: keyof TravelFormData) {
    touched.value[field] = true
    validateField(field)
  }

  /**
   * Generate travel plan from form data
   */
  async function generatePlan(): Promise<boolean> {
    // First validate the form
    if (!validateForm()) {
      return false
    }

    isGenerating.value = true
    generationError.value = null

    try {
      // Generate the plan using the algorithm with timezone offset
      const plan = generateTravelPlan(formData.value, timezoneOffset.value)

      travelPlan.value = plan
      return true
    }
    catch (error) {
      generationError.value = error instanceof Error ? error.message : 'Failed to generate plan'
      console.error('Error generating travel plan:', error)
      return false
    }
    finally {
      isGenerating.value = false
    }
  }

  /**
   * Clear the generated plan
   */
  function clearPlan() {
    travelPlan.value = null
    generationError.value = null
  }

  return {
    // State
    formData,
    errors,
    touched,
    travelPlan,
    isGenerating,
    generationError,

    // Computed
    sleepDuration,
    timezoneOffset,
    travelDirection,
    isFormValid,

    // Actions
    updateField,
    validateField,
    validateForm,
    resetForm,
    markFieldTouched,
    generatePlan,
    clearPlan,
  }
})
