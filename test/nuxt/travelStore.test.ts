import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTravelStore } from '~/stores/travelStore'

describe('useTravelStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('form validation', () => {
    it('should initially have homeTimezone set and other required fields with defaults', () => {
      const store = useTravelStore()

      expect(store.formData.homeTimezone).toBeTruthy()
      expect(store.formData.departureDate).toBeTruthy()
      expect(store.formData.departureTime).toBe('09:00')
      expect(store.formData.currentBedtime).toBe('23:00')
      expect(store.formData.currentWakeTime).toBe('07:00')
      expect(store.formData.destinationTimezone).toBe('')
    })

    it('should have no actual errors when form is valid', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', 'America/New_York')

      const actualErrors = Object.values(store.errors).filter(e => e !== undefined)
      expect(actualErrors.length).toBe(0)
      expect(store.isFormValid).toBe(true)
    })

    it('should set error when destinationTimezone is empty', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', '')

      expect(store.errors.destinationTimezone).toBe('Destination timezone is required')
    })

    it('should remove error value from errors object when field is valid', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', '')
      expect(store.errors.destinationTimezone).toBeDefined()

      store.updateField('destinationTimezone', 'America/New_York')
      expect(store.errors.destinationTimezone).toBeUndefined()
      const actualErrors = Object.values(store.errors).filter(e => e !== undefined)
      expect(actualErrors.length).toBe(0)
    })

    it('should set error when destination equals home timezone', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', store.formData.homeTimezone)

      expect(store.errors.destinationTimezone).toBe('Destination must be different from home timezone')
    })

    it('should remove error when destination is changed to different timezone', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', store.formData.homeTimezone)
      expect(store.errors.destinationTimezone).toBeDefined()
      const errorsBefore = Object.values(store.errors).filter(e => e !== undefined)
      expect(errorsBefore.length).toBeGreaterThan(0)

      store.updateField('destinationTimezone', 'America/Los_Angeles')
      expect(store.errors.destinationTimezone).toBeUndefined()
      const actualErrors = Object.values(store.errors).filter(e => e !== undefined)
      expect(actualErrors.length).toBe(0)
    })

    it('should set error for past departure date', () => {
      const store = useTravelStore()

      store.updateField('departureDate', '2020-01-01')

      expect(store.errors.departureDate).toBe('Departure date cannot be in the past')
    })

    it('should remove error value when departure date is valid', () => {
      const store = useTravelStore()

      store.updateField('departureDate', '2020-01-01')
      expect(store.errors.departureDate).toBeDefined()
      const errorsBefore = Object.values(store.errors).filter(e => e !== undefined)
      expect(errorsBefore.length).toBeGreaterThan(0)

      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      store.updateField('departureDate', tomorrowStr!)
      expect(store.errors.departureDate).toBeUndefined()
      const actualErrors = Object.values(store.errors).filter(e => e !== undefined)
      expect(actualErrors.length).toBe(0)
    })

    it('should set error for invalid sleep duration (less than 4 hours)', () => {
      const store = useTravelStore()

      store.updateField('currentBedtime', '07:00')
      store.updateField('currentWakeTime', '08:00')

      expect(store.errors.currentWakeTime).toBe('Sleep duration seems too short (less than 4 hours)')
    })

    it('should set error for invalid sleep duration (more than 14 hours)', () => {
      const store = useTravelStore()

      store.updateField('currentWakeTime', '22:00')
      store.updateField('currentBedtime', '21:00')

      expect(store.errors.currentWakeTime).toBe('Sleep duration seems too long (more than 14 hours)')
    })

    it('should remove error when field value becomes valid', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', '')
      expect(store.errors.destinationTimezone).toBeDefined()

      store.updateField('destinationTimezone', 'America/New_York')
      expect(store.errors.destinationTimezone).toBeUndefined()
      const actualErrors = Object.values(store.errors).filter(e => e !== undefined)
      expect(actualErrors.length).toBe(0)
    })

    it('should correctly report isFormValid when all fields are valid', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', 'Europe/London')

      expect(store.isFormValid).toBe(true)
    })

    it('should have no actual errors after setting all required fields', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', 'Asia/Tokyo')

      const actualErrors = Object.values(store.errors).filter(e => e !== undefined)
      expect(actualErrors.length).toBe(0)
    })

    it('should mark fields as touched when updated', () => {
      const store = useTravelStore()

      expect(store.touched.destinationTimezone).toBeUndefined()

      store.updateField('destinationTimezone', 'Europe/Paris')

      expect(store.touched.destinationTimezone).toBe(true)
    })

    it('should clear all errors when resetForm is called', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', '')
      store.updateField('departureDate', '2020-01-01')

      expect(Object.keys(store.errors).length).toBeGreaterThan(0)

      store.resetForm()

      expect(Object.keys(store.errors).length).toBe(0)
    })

    it('should only have truthy error values after field validation', () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', 'America/Chicago')

      for (const key of Object.keys(store.errors)) {
        const errorValue = store.errors[key as keyof typeof store.errors]
        if (errorValue !== undefined) {
          expect(errorValue).toBeTruthy()
        }
      }
    })
  })

  describe('generatePlan', () => {
    it('should return false when form is invalid', async () => {
      const store = useTravelStore()

      const result = await store.generatePlan()

      expect(result).toBe(false)
    })

    it('should return true and generate plan when form is valid', async () => {
      const store = useTravelStore()

      store.updateField('destinationTimezone', 'Europe/Paris')

      const result = await store.generatePlan()

      expect(result).toBe(true)
      expect(store.travelPlan).not.toBeNull()
    })
  })
})
