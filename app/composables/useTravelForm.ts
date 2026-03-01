/**
 * Composable for managing travel form state via URL query parameters
 */

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
  // homeTimezone intentionally starts empty to avoid SSR/client hydration mismatches;
  // it is set to the detected browser timezone in onMounted below.
  const formData = reactive<TravelFormData>({
    homeTimezone: (route.query.homeTimezone as string) || '',
    destinationTimezone: (route.query.destinationTimezone as string) || '',
    departureDate: (route.query.departureDate as string) || getTodayDate(),
    departureTime: (route.query.departureTime as string) || '09:00',
    currentBedtime: (route.query.currentBedtime as string) || '23:00',
    currentWakeTime: (route.query.currentWakeTime as string) || '07:00',
  })

  // Form validation state
  const errors = reactive<Partial<Record<keyof TravelFormData, string>>>({})
  const touched = reactive<Partial<Record<keyof TravelFormData, boolean>>>({})

  // Detect and apply the user's browser timezone only on the client, after hydration
  onMounted(() => {
    if (!formData.homeTimezone) {
      formData.homeTimezone = getCurrentTimezone()
    }
  })

  // Computed values
  const sleepDuration = computed(() => {
    return calculateSleepDuration(formData.currentBedtime, formData.currentWakeTime)
  })

  const timezoneOffset = computed(() => {
    if (!formData.homeTimezone || !formData.destinationTimezone) {
      return 0
    }
    let departureDateTime: Date
    if (formData.departureDate && formData.departureTime) {
      try {
        departureDateTime = new Date(`${formData.departureDate}T${formData.departureTime}`)
      }
      catch {
        departureDateTime = new Date()
      }
    }
    else {
      departureDateTime = new Date()
    }
    return calculateTimezoneOffset(formData.homeTimezone, formData.destinationTimezone, departureDateTime)
  })

  const travelDirection = computed(() => {
    return getTravelDirection(timezoneOffset.value)
  })

  const isFormValid = computed(() => {
    const hasActualErrors = Object.values(errors).some(error => error !== undefined)
    return !hasActualErrors && hasRequiredFields()
  })

  // Helper to check if all required fields are filled
  function hasRequiredFields(): boolean {
    return !!(
      formData.homeTimezone
      && formData.destinationTimezone
      && formData.departureDate
      && formData.departureTime
      && formData.currentBedtime
      && formData.currentWakeTime
    )
  }

  // Update field and sync to URL
  function updateField<K extends keyof TravelFormData>(field: K, value: TravelFormData[K]) {
    formData[field] = value
    touched[field] = true
    validateField(field)
    syncToUrl()
  }

  // Validate single field
  function validateField(field: keyof TravelFormData) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete errors[field]

    switch (field) {
      case 'homeTimezone':
        if (!formData.homeTimezone) {
          errors.homeTimezone = 'Home timezone is required'
        }
        break

      case 'destinationTimezone':
        if (!formData.destinationTimezone) {
          errors.destinationTimezone = 'Destination timezone is required'
        }
        else if (formData.destinationTimezone === formData.homeTimezone) {
          errors.destinationTimezone = 'Destination must be different from home timezone'
        }
        break

      case 'departureDate':
        if (!formData.departureDate) {
          errors.departureDate = 'Departure date is required'
        }
        else {
          const dateParts = formData.departureDate.split('-').map(Number)
          const [year, month, day] = dateParts as [number, number, number]
          const departureDate = new Date(year, month - 1, day)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (departureDate < today) {
            errors.departureDate = 'Departure date cannot be in the past'
          }
        }
        break

      case 'departureTime':
        if (!formData.departureTime) {
          errors.departureTime = 'Departure time is required'
        }
        break

      case 'currentBedtime':
        if (!formData.currentBedtime) {
          errors.currentBedtime = 'Bedtime is required'
        }
        break

      case 'currentWakeTime':
        if (!formData.currentWakeTime) {
          errors.currentWakeTime = 'Wake time is required'
        }
        else if (sleepDuration.value < 4) {
          errors.currentWakeTime = 'Sleep duration seems too short (less than 4 hours)'
        }
        else if (sleepDuration.value > 14) {
          errors.currentWakeTime = 'Sleep duration seems too long (more than 14 hours)'
        }
        break
    }
  }

  // Validate entire form
  function validateForm(): boolean {
    Object.keys(formData).forEach((key) => {
      touched[key as keyof TravelFormData] = true
      validateField(key as keyof TravelFormData)
    })
    return isFormValid.value
  }

  // Reset form to defaults (clear URL params)
  function resetForm() {
    Object.assign(formData, {
      homeTimezone: getCurrentTimezone(),
      destinationTimezone: '',
      departureDate: getTodayDate(),
      departureTime: '09:00',
      currentBedtime: '23:00',
      currentWakeTime: '07:00',
    })
    Object.keys(errors).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete errors[k as keyof TravelFormData]
    })
    Object.keys(touched).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete touched[k as keyof TravelFormData]
    })
    syncToUrl()
  }

  // Mark field as touched
  function markFieldTouched(field: keyof TravelFormData) {
    touched[field] = true
    validateField(field)
  }

  // Sync form data to URL query params
  function syncToUrl() {
    const query = {
      homeTimezone: formData.homeTimezone,
      destinationTimezone: formData.destinationTimezone,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      currentBedtime: formData.currentBedtime,
      currentWakeTime: formData.currentWakeTime,
    }
    router.replace({ query })
  }

  // Check if params are valid
  function hasValidParams(): boolean {
    return !!(
      formData.homeTimezone
      && formData.destinationTimezone
      && formData.departureDate
      && formData.departureTime
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
