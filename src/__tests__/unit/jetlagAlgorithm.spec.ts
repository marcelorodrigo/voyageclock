import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateTravelPlan } from '@/services/jetlagAlgorithm'
import type { TravelFormData } from '@/types/travel'

describe('Jet Lag Algorithm', () => {
  let mockFormData: TravelFormData

  beforeEach(() => {
    // Reset to a known date for testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))

    mockFormData = {
      homeTimezone: 'America/New_York',
      destinationTimezone: 'Europe/London',
      departureDate: '2024-01-20',
      departureTime: '18:00',
      daysAtDestination: 7,
      currentBedtime: '23:00',
      currentWakeTime: '07:00',
    }
  })

  describe('Pre-Travel Adaptation Phase', () => {
    it('should not generate pre-travel recommendations if trip is today', () => {
      mockFormData.departureDate = '2024-01-15'

      const plan = generateTravelPlan(mockFormData, 5) // 5 hour offset

      expect(plan.preTravel).toHaveLength(0)
    })

    it('should generate pre-travel recommendations for trip in 3 days with 5 hour offset', () => {
      mockFormData.departureDate = '2024-01-18' // 3 days from now

      const plan = generateTravelPlan(mockFormData, 5) // 5 hour eastward travel

      // Should generate 3 pre-travel days (limited by days available)
      expect(plan.preTravel).toHaveLength(3)
    })

    it('should limit pre-travel recommendations to max 5 days', () => {
      mockFormData.departureDate = '2024-01-25' // 10 days from now

      const plan = generateTravelPlan(mockFormData, 9) // 9 hour offset (would need ~6 days ideally)

      // Should generate max 5 pre-travel days as per requirements
      expect(plan.preTravel).toHaveLength(5)
    })

    it('should not generate pre-travel recommendations for small timezone differences', () => {
      mockFormData.departureDate = '2024-01-20' // 5 days from now

      const plan = generateTravelPlan(mockFormData, 2) // Only 2 hours

      // Should not generate pre-travel for <=2 hour difference
      expect(plan.preTravel).toHaveLength(0)
    })

    it('should calculate gradual cumulative shifts for eastward travel', () => {
      mockFormData.departureDate = '2024-01-18' // 3 days from now

      const plan = generateTravelPlan(mockFormData, 6) // 6 hour eastward travel

      expect(plan.preTravel).toHaveLength(3)

      // First day: shift earlier by ~2 hours (6 hours / 3 days)
      const firstDay = plan.preTravel[0]
      expect(firstDay.dayNumber).toBe(-3)
      expect(firstDay.sleep.bedtime).toBe('21:00') // 23:00 - 2 hours
      expect(firstDay.sleep.wakeTime).toBe('05:00') // 07:00 - 2 hours

      // Second day: shift earlier by ~4 hours cumulative
      const secondDay = plan.preTravel[1]
      expect(secondDay.dayNumber).toBe(-2)
      expect(secondDay.sleep.bedtime).toBe('19:00') // 23:00 - 4 hours
      expect(secondDay.sleep.wakeTime).toBe('03:00') // 07:00 - 4 hours

      // Third day: shift earlier by ~6 hours cumulative
      const thirdDay = plan.preTravel[2]
      expect(thirdDay.dayNumber).toBe(-1)
      expect(thirdDay.sleep.bedtime).toBe('17:00') // 23:00 - 6 hours
      expect(thirdDay.sleep.wakeTime).toBe('01:00') // 07:00 - 6 hours
    })

    it('should calculate gradual cumulative shifts for westward travel', () => {
      mockFormData.departureDate = '2024-01-18' // 3 days from now
      mockFormData.destinationTimezone = 'America/Los_Angeles'

      const plan = generateTravelPlan(mockFormData, -3) // 3 hour westward travel

      // 3 hours offset generates 2 pre-travel days (calculateAdjustmentDays logic)
      expect(plan.preTravel).toHaveLength(2)

      // First day: shift later by ~1.5 hours (3 hours / 2 days)
      const firstDay = plan.preTravel[0]
      expect(firstDay.sleep.bedtime).toBe('00:30') // 23:00 + 1.5 hours
      expect(firstDay.sleep.wakeTime).toBe('08:30') // 07:00 + 1.5 hours

      // Second day: shift later by ~3 hours cumulative
      const secondDay = plan.preTravel[1]
      expect(secondDay.sleep.bedtime).toBe('02:00') // 23:00 + 3 hours
      expect(secondDay.sleep.wakeTime).toBe('10:00') // 07:00 + 3 hours
    })

    it('should include appropriate light exposure recommendations for eastward travel', () => {
      mockFormData.departureDate = '2024-01-18'

      const plan = generateTravelPlan(mockFormData, 5) // 5 hour eastward

      const firstDay = plan.preTravel[0]

      // Eastward travel should recommend morning light exposure
      expect(firstDay.lightExposure).toHaveLength(1)
      expect(firstDay.lightExposure[0].priority).toBe('critical')
      expect(firstDay.lightExposure[0].notes).toContain('bright light')
    })

    it('should include appropriate light avoidance recommendations for eastward travel', () => {
      mockFormData.departureDate = '2024-01-18'

      const plan = generateTravelPlan(mockFormData, 5) // 5 hour eastward

      const firstDay = plan.preTravel[0]

      // Eastward travel should recommend avoiding evening light
      expect(firstDay.lightAvoidance).toHaveLength(1)
      expect(firstDay.lightAvoidance[0].priority).toBe('critical')
    })

    it('should include melatonin recommendations for large timezone differences', () => {
      mockFormData.departureDate = '2024-01-18'

      const plan = generateTravelPlan(mockFormData, 6) // >= 3 hour threshold

      const firstDay = plan.preTravel[0]

      expect(firstDay.melatonin).toBeDefined()
      expect(firstDay.melatonin?.dosage).toBe('0.5-3mg')
    })

    it('should not include melatonin for small timezone differences', () => {
      mockFormData.departureDate = '2024-01-18'

      const plan = generateTravelPlan(mockFormData, 2) // <= 2 hours

      // No pre-travel recommendations for <= 2 hours
      expect(plan.preTravel).toHaveLength(0)
    })

    it('should include exercise recommendations aligned with light exposure', () => {
      mockFormData.departureDate = '2024-01-18'

      const plan = generateTravelPlan(mockFormData, 5) // 5 hour eastward

      const firstDay = plan.preTravel[0]

      expect(firstDay.exercise).toBeDefined()
      expect(firstDay.exercise?.intensity).toBe('moderate')
    })

    it('should include caffeine cutoff recommendations', () => {
      mockFormData.departureDate = '2024-01-18'

      const plan = generateTravelPlan(mockFormData, 5) // 5 hour eastward

      const firstDay = plan.preTravel[0]

      expect(firstDay.caffeine).toBeDefined()
      expect(firstDay.caffeine?.allowedUntil).toBeDefined()
    })

    it('should include helpful general notes for pre-travel phase', () => {
      mockFormData.departureDate = '2024-01-18'

      const plan = generateTravelPlan(mockFormData, 5) // 5 hour eastward

      const firstDay = plan.preTravel[0]

      expect(firstDay.generalNotes).toBeDefined()
      expect(firstDay.generalNotes!.length).toBeGreaterThan(0)
      expect(firstDay.generalNotes!.some(note => note.includes('days until departure'))).toBe(true)
    })

    it('should maintain sleep duration across all pre-travel days', () => {
      mockFormData.departureDate = '2024-01-18'

      const plan = generateTravelPlan(mockFormData, 6) // 6 hour eastward

      const expectedDuration = 8 // 23:00 to 07:00 = 8 hours

      plan.preTravel.forEach(day => {
        expect(day.sleep.duration).toBeCloseTo(expectedDuration, 0.1)
      })
    })
  })

  describe('Post-Arrival Phase', () => {
    it('should generate post-arrival recommendations', () => {
      const plan = generateTravelPlan(mockFormData, 5) // 5 hour eastward

      expect(plan.postArrival.length).toBeGreaterThan(0)
    })

    it('should recommend local sleep times at destination', () => {
      const plan = generateTravelPlan(mockFormData, 5) // 5 hour eastward

      const firstDay = plan.postArrival[0]

      // Should use the same sleep schedule as home (but in destination timezone)
      expect(firstDay.sleep.bedtime).toBe(mockFormData.currentBedtime)
      expect(firstDay.sleep.wakeTime).toBe(mockFormData.currentWakeTime)
    })

    it('should include melatonin for first 3 days only', () => {
      mockFormData.daysAtDestination = 10

      const plan = generateTravelPlan(mockFormData, 6) // 6 hour eastward

      // Check first 3 days have melatonin
      expect(plan.postArrival[0].melatonin).toBeDefined()
      expect(plan.postArrival[1].melatonin).toBeDefined()
      expect(plan.postArrival[2].melatonin).toBeDefined()

      // Day 4+ should not have melatonin
      if (plan.postArrival.length > 3) {
        expect(plan.postArrival[3].melatonin).toBeUndefined()
      }
    })
  })

  describe('Travel Day', () => {
    it('should generate travel day recommendations', () => {
      const plan = generateTravelPlan(mockFormData, 5) // 5 hour offset

      expect(plan.travelDay).toBeDefined()
      expect(plan.travelDay.date).toEqual(plan.departureDate)
    })

    it('should include sleep strategy for long flights', () => {
      const plan = generateTravelPlan(mockFormData, 8) // 8 hour offset

      expect(plan.travelDay.sleepStrategy).toBeDefined()
      expect(plan.travelDay.sleepStrategy).toContain('sleep')
    })

    it('should include hydration recommendations', () => {
      const plan = generateTravelPlan(mockFormData, 0) // No offset needed for this test

      expect(plan.travelDay.hydration).toBeDefined()
      expect(plan.travelDay.hydration).toContain('water')
    })

    it('should include movement recommendations', () => {
      const plan = generateTravelPlan(mockFormData, 0) // No offset needed for this test

      expect(plan.travelDay.movement).toBeDefined()
      expect(plan.travelDay.movement).toContain('walk')
    })
  })

  describe('Edge Cases', () => {
    it('should handle trip departing tomorrow with large timezone difference', () => {
      mockFormData.departureDate = '2024-01-16' // Tomorrow

      const plan = generateTravelPlan(mockFormData, 8) // 8 hour eastward

      // Should generate 1 pre-travel day
      expect(plan.preTravel).toHaveLength(1)
      expect(plan.preTravel[0].dayNumber).toBe(-1)
    })

    it('should handle trip departing in exactly 5 days', () => {
      mockFormData.departureDate = '2024-01-20' // 5 days from now

      const plan = generateTravelPlan(mockFormData, 10) // 10 hour eastward

      // Should generate exactly 5 pre-travel days (max allowed)
      expect(plan.preTravel).toHaveLength(5)
    })

    it('should handle very short trips', () => {
      mockFormData.daysAtDestination = 2

      const plan = generateTravelPlan(mockFormData, 6) // 6 hour offset

      // Post-arrival should be limited by trip duration
      expect(plan.postArrival.length).toBeLessThanOrEqual(2)
    })

    it('should generate unique plan IDs', () => {
      const plan1 = generateTravelPlan(mockFormData, 0)
      const plan2 = generateTravelPlan(mockFormData, 0)

      expect(plan1.id).not.toBe(plan2.id)
    })
  })
})

