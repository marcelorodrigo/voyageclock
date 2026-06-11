/**
 * Composable for detecting and setting the client's browser timezone
 * Must be called within a Vue component's setup()
 */
import type { TravelFormData } from '~/types/travel'
import { getCurrentTimezone } from '~/utils/timezoneService'

export function useClientTimezone(formData: TravelFormData) {
  onMounted(() => {
    if (!formData.homeTimezone) {
      formData.homeTimezone = getCurrentTimezone()
    }
  })
}
