import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTravelForm } from '~/composables/useTravelForm'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ query: {} }),
    useRouter: () => ({ replace: vi.fn() }),
  }
})

describe('useTravelForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { formData } = useTravelForm()

      expect(formData.value.homeTimezone).toBeDefined()
      expect(formData.value.destinationTimezone).toBe('')
      expect(formData.value.departureDate).toBeDefined()
      expect(formData.value.departureTime).toBe('09:00')
      expect(formData.value.currentBedtime).toBe('23:00')
      expect(formData.value.currentWakeTime).toBe('07:00')
    })

    it('should initialize with no errors', () => {
      const { errors } = useTravelForm()

      expect(Object.keys(errors.value)).toHaveLength(0)
    })

    it('should initialize with isFormValid as false', () => {
      const { isFormValid } = useTravelForm()
      expect(isFormValid.value).toBe(false)
    })
  })

  describe('updateField', () => {
    it('should update a field value', () => {
      const { updateField, formData } = useTravelForm()

      updateField('destinationTimezone', 'Europe/London')
      expect(formData.value.destinationTimezone).toBe('Europe/London')

      updateField('departureTime', '14:00')
      expect(formData.value.departureTime).toBe('14:00')
    })

    it('should mark field as touched', () => {
      const { updateField, touched } = useTravelForm()

      updateField('homeTimezone', 'America/New_York')
      expect(touched.value.homeTimezone).toBe(true)
    })

    it('should validate the field after update', () => {
      const { updateField, errors } = useTravelForm()

      updateField('homeTimezone', '')
      expect(errors.value.homeTimezone).toBe('Home timezone is required')

      updateField('homeTimezone', 'America/New_York')
      expect(errors.value.homeTimezone).toBeUndefined()
    })
  })

  describe('field validations', () => {
    it('should validate homeTimezone is required', () => {
      const { updateField, errors } = useTravelForm()
      updateField('homeTimezone', '')
      expect(errors.value.homeTimezone).toBe('Home timezone is required')
      updateField('homeTimezone', 'America/New_York')
      expect(errors.value.homeTimezone).toBeUndefined()
    })

    it('should validate destinationTimezone is required', () => {
      const { formData, updateField, errors } = useTravelForm()

      formData.value.homeTimezone = 'America/New_York'

      updateField('destinationTimezone', '')
      expect(errors.value.destinationTimezone).toBe('Destination timezone is required')

      updateField('destinationTimezone', 'America/New_York')
      expect(errors.value.destinationTimezone).toBe('Destination must be different from home timezone')

      updateField('destinationTimezone', 'Europe/London')
      expect(errors.value.destinationTimezone).toBeUndefined()
    })

    it('should validate departureDate is required and not in past', () => {
      const { updateField, errors } = useTravelForm()

      updateField('departureDate', '')
      expect(errors.value.departureDate).toBe('Departure date is required')

      updateField('departureDate', '2020-01-01')
      expect(errors.value.departureDate).toBeTruthy()
      expect(errors.value.departureDate).toContain('past')

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      updateField('departureDate', futureDate.toISOString().split('T')[0] as string)
      expect(errors.value.departureDate).toBeUndefined()
    })

    it('should validate departureTime is required', () => {
      const { updateField, errors } = useTravelForm()
      updateField('departureTime', '')
      expect(errors.value.departureTime).toBe('Departure time is required')
      updateField('departureTime', '09:00')
      expect(errors.value.departureTime).toBeUndefined()
    })

    it('should validate currentBedtime is required', () => {
      const { updateField, errors } = useTravelForm()
      updateField('currentBedtime', '')
      expect(errors.value.currentBedtime).toBe('Bedtime is required')
      updateField('currentBedtime', '23:00')
      expect(errors.value.currentBedtime).toBeUndefined()
    })

    it('should validate currentWakeTime is required and sleep duration', () => {
      const { updateField, errors } = useTravelForm()

      updateField('currentWakeTime', '')
      expect(errors.value.currentWakeTime).toBe('Wake time is required')

      updateField('currentBedtime', '22:00')
      updateField('currentWakeTime', '01:59')
      expect(errors.value.currentWakeTime).toContain('too short')

      updateField('currentBedtime', '20:00')
      updateField('currentWakeTime', '14:00')
      expect(errors.value.currentWakeTime).toContain('too long')

      updateField('currentBedtime', '23:00')
      updateField('currentWakeTime', '07:00')
      expect(errors.value.currentWakeTime).toBeUndefined()
    })
  })

  describe('isFormValid', () => {
    it('should be false when required fields are missing', () => {
      const { isFormValid, updateField } = useTravelForm()

      updateField('homeTimezone', '')
      updateField('destinationTimezone', '')
      updateField('departureDate', '')
      updateField('departureTime', '')
      updateField('currentBedtime', '')
      updateField('currentWakeTime', '')
      expect(isFormValid.value).toBe(false)

      updateField('homeTimezone', 'America/New_York')
      expect(isFormValid.value).toBe(false)

      updateField('destinationTimezone', 'Europe/London')
      expect(isFormValid.value).toBe(false)

      updateField('departureDate', '')
      expect(isFormValid.value).toBe(false)

      updateField('departureTime', '')
      expect(isFormValid.value).toBe(false)

      updateField('currentBedtime', '')
      expect(isFormValid.value).toBe(false)

      updateField('currentWakeTime', '')
      expect(isFormValid.value).toBe(false)
    })
  })

  describe('validateForm', () => {
    it('should validate all fields and mark them as touched', () => {
      const { validateForm, touched, errors, updateField } = useTravelForm()

      updateField('homeTimezone', '')

      const isValid = validateForm()

      expect(isValid).toBe(false)
      expect(touched.value.homeTimezone).toBe(true)
      expect(errors.value.homeTimezone).toBeDefined()
    })
  })

  describe('resetForm', () => {
    it('should reset form to default values', () => {
      const { resetForm, formData, errors, touched, updateField } = useTravelForm()

      updateField('homeTimezone', 'Europe/Paris')
      updateField('destinationTimezone', 'Asia/Tokyo')
      updateField('departureTime', '15:00')

      resetForm()

      expect(formData.value.homeTimezone).toBeDefined()
      expect(formData.value.destinationTimezone).toBe('')
      expect(formData.value.departureTime).toBe('09:00')
      expect(formData.value.currentBedtime).toBe('23:00')
      expect(formData.value.currentWakeTime).toBe('07:00')
      expect(Object.keys(errors.value)).toHaveLength(0)
      expect(Object.keys(touched.value)).toHaveLength(0)
    })
  })

  describe('computed properties', () => {
    it('should calculate sleepDuration correctly', () => {
      const { sleepDuration, updateField } = useTravelForm()

      updateField('currentBedtime', '23:00')
      updateField('currentWakeTime', '07:00')
      expect(sleepDuration.value).toBe(8)

      updateField('currentBedtime', '22:00')
      updateField('currentWakeTime', '06:00')
      expect(sleepDuration.value).toBe(8)
    })

    it('should calculate timezoneOffset correctly when both timezones are set', () => {
      const { timezoneOffset, updateField } = useTravelForm()

      updateField('homeTimezone', 'America/New_York')
      updateField('destinationTimezone', 'Europe/London')

      expect(timezoneOffset.value).toBeDefined()
    })

    it('should return 0 for timezoneOffset when timezones are missing', () => {
      const { timezoneOffset, updateField } = useTravelForm()

      updateField('homeTimezone', '')
      updateField('destinationTimezone', '')

      expect(timezoneOffset.value).toBe(0)
    })

    it('should determine travelDirection from timezoneOffset', () => {
      const { travelDirection, updateField } = useTravelForm()

      updateField('homeTimezone', 'America/New_York')
      updateField('destinationTimezone', 'Europe/London')

      expect(['east', 'west']).toContain(travelDirection.value)
    })
  })

  describe('hasValidParams', () => {
    it('should return false when required params are missing', () => {
      const { hasValidParams } = useTravelForm()

      expect(hasValidParams()).toBe(false)
    })

    it('should return true when required params are present', () => {
      const { hasValidParams, updateField } = useTravelForm()

      updateField('homeTimezone', 'America/New_York')
      updateField('destinationTimezone', 'Europe/London')
      updateField('departureDate', '2024-12-01')
      updateField('departureTime', '09:00')

      expect(hasValidParams()).toBe(true)
    })
  })
})
