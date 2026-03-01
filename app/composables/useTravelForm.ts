/**
 * Composable for managing travel form state via URL query parameters
 */

import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TravelFormData } from '~/types/travel'
import {
  getCurrentTimezone,
  calculateTimezoneOffset,
  getTravelDirection,
} from '~/utils/timezoneService'
import { calculateSleepDuration, getTodayDate } from '~/utils/dateTimeUtils'

export function useTravelForm() {
  const route = useRoute()
  const router = useRouter()

  // Initialize form data from URL params or defaults
  const formData = ref<TravelFormData>({
    homeTimezone: (route.query.home as string) || getCurrentTimezone(),
    destinationTimezone: (route.query.dest as string) || '',
    departureDate: (route.query.date as string) || getTodayDate(),
    departureTime: (route.query.time as string) || '09:00',
    currentBedtime: (route.query.bed as string) || '23:00',
    currentWakeTime: (route.query.wake as string) || '07:00',
  })

  // Form validation state
  const errors = ref<Partial<Record<keyof TravelFormData, string>>>({})
  const touched = ref<Partial<Record<keyof TravelFormData, boolean>>>({})

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

  // Update field and sync to URL
  function updateField<K extends keyof TravelFormData>(field: K, value: TravelFormData[K]) {
    formData.value[field] = value
    touched.value[field] = true
    validateField(field)
    syncToUrl()
  }

  // Validate single field
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

  // Validate entire form
  function validateForm(): boolean {
    Object.keys(formData.value).forEach((key) => {
      touched.value[key as keyof TravelFormData] = true
      validateField(key as keyof TravelFormData)
    })
    return isFormValid.value
  }

  // Reset form to defaults (clear URL params)
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
    syncToUrl()
  }

  // Mark field as touched
  function markFieldTouched(field: keyof TravelFormData) {
    touched.value[field] = true
    validateField(field)
  }

  // Sync form data to URL query params
  function syncToUrl() {
    const query = {
      home: formData.value.homeTimezone,
      dest: formData.value.destinationTimezone,
      date: formData.value.departureDate,
      time: formData.value.departureTime,
      bed: formData.value.currentBedtime,
      wake: formData.value.currentWakeTime,
    }
    router.replace({ query })
  }

  // Check if params are valid
  function hasValidParams(): boolean {
    return !!(
      formData.value.homeTimezone
      && formData.value.destinationTimezone
      && formData.value.departureDate
      && formData.value.departureTime
    )
  }

  return {
    // State
    formData,
    errors,
    touched,

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
    syncToUrl,
    hasValidParams,
  }
}
