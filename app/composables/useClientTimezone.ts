/**
 * Composable for detecting and setting the client's browser timezone
 * Must be called within a Vue component's setup()
 */
import type { TravelFormData } from '~/types/travel'
import { getCurrentTimezone } from '~/utils/timezoneService'

export interface ClientTimezoneForm {
  formData: TravelFormData
  updateField: <K extends keyof TravelFormData>(field: K, value: TravelFormData[K]) => void
}

export function useClientTimezone(form: ClientTimezoneForm) {
  onMounted(() => {
    if (!form.formData.homeTimezone) {
      form.updateField('homeTimezone', getCurrentTimezone())
    }
  })
}
