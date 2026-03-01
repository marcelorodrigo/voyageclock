/**
 * Composable for generating and managing travel plans from URL parameters
 */

import type { TravelPlan } from '~/types/travel'
import { generateTravelPlan } from '~/utils/jetlagAlgorithm'
import { useTravelForm } from './useTravelForm'

export function useTravelPlan() {
  const travelForm = useTravelForm()

  // Generated travel plan; start in loading state when params are already present
  const travelPlan = ref<TravelPlan | null>(null)
  const isGenerating = ref(travelForm.hasValidParams())
  const generationError = ref<string | null>(null)

  // Generate plan if valid params exist
  async function generatePlan(): Promise<boolean> {
    if (!travelForm.hasValidParams()) {
      generationError.value = 'Missing or invalid travel parameters'
      return false
    }

    // Validate form
    if (!travelForm.validateForm()) {
      return false
    }

    isGenerating.value = true
    generationError.value = null

    try {
      const plan = generateTravelPlan(travelForm.formData, travelForm.timezoneOffset.value)
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

  // Clear the generated plan
  function clearPlan() {
    travelPlan.value = null
    generationError.value = null
  }

  return reactive({
    // From form composable
    formData: travelForm.formData,
    errors: travelForm.errors,
    touched: travelForm.touched,
    sleepDuration: travelForm.sleepDuration,
    timezoneOffset: travelForm.timezoneOffset,
    travelDirection: travelForm.travelDirection,
    isFormValid: travelForm.isFormValid,
    updateField: travelForm.updateField,
    validateField: travelForm.validateField,
    validateForm: travelForm.validateForm,
    resetForm: travelForm.resetForm,
    markFieldTouched: travelForm.markFieldTouched,
    hasValidParams: travelForm.hasValidParams,

    // Plan-specific
    travelPlan,
    isGenerating,
    generationError,
    generatePlan,
    clearPlan,
  })
}
