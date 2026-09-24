import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'
import { generatePlan } from '../../app/utils/planner/generatePlan'
import type { TripInput } from '../../app/types/travel'

const now = Temporal.Instant.from('2027-06-01T12:00Z')
const trip: TripInput = {
  originTimeZone: 'America/New_York',
  destinationTimeZone: 'Europe/London',
  departureLocal: '2027-06-10T09:00',
  arrivalLocal: '2027-06-10T21:00',
  usualBedtime: '23:00',
  usualWakeTime: '07:00',
  usesCaffeine: true,
}

describe('generatePlan', () => {
  it('creates no more than three preparation days plus arrival and next day', () => {
    const plan = generatePlan(trip, now)
    expect(plan.direction).toBe('eastward')
    expect(plan.days).toHaveLength(5)
    expect(plan.days.map(day => day.stage)).toEqual(['preflight', 'preflight', 'preflight', 'arrival', 'postArrival'])
    expect(plan.days.at(-2)?.date).toBe('2027-06-10')
    expect(plan.days.at(-1)?.date).toBe('2027-06-11')
  })

  it('uses the usual sleep schedule for arrival after three preparation days', () => {
    const plan = generatePlan(trip, now)
    const arrival = plan.days.find(day => day.stage === 'arrival')

    expect(arrival?.guidance.sleep).toMatchObject({ key: 'guidance.sleepOpportunity', params: { bedtime: '23:00', wakeTime: '07:00' } })
  })

  it('does not recommend a 30-minute shift for a minimal timezone difference', () => {
    const plan = generatePlan({
      ...trip,
      destinationTimeZone: 'America/New_York',
      arrivalLocal: '2027-06-10T21:00',
    }, now)

    expect(plan.direction).toBe('minimal')
    expect(plan.days[0]?.guidance.explanation).toEqual({ key: 'guidance.preparationMinimal' })
  })

  it('shifts preparation sleep times later for a westward trip', () => {
    const plan = generatePlan({
      ...trip,
      originTimeZone: 'Europe/London',
      destinationTimeZone: 'America/New_York',
    }, now)

    expect(plan.direction).toBe('westward')
    expect(plan.days[0]?.guidance.sleep).toMatchObject({ key: 'guidance.sleepShift', params: { bedtime: '23:30', wakeTime: '07:30', movement: { key: 'movements.later' } } })
    expect(plan.days[0]?.guidance.wake).toMatchObject({ key: 'guidance.wake', params: { wakeTime: '07:30' } })
    expect(plan.days[0]?.guidance.explanation).toMatchObject({ key: 'guidance.preparationShift', params: { movement: { key: 'movements.later' } } })
  })

  it('starts preparation with actual available days for an imminent trip', () => {
    const plan = generatePlan({ ...trip, departureLocal: '2027-06-02T09:00', arrivalLocal: '2027-06-02T21:00' }, now)
    expect(plan.days.map(day => day.stage)).toEqual(['preflight', 'arrival', 'postArrival'])
    expect(plan.limitations[0]).toEqual({ key: 'guidance.limitedPreparation', params: { count: 1 } })
  })

  it('does not shift sleep times when departure is today and no preparation day remains', () => {
    const plan = generatePlan({
      ...trip,
      departureLocal: '2027-06-01T10:00',
      arrivalLocal: '2027-06-01T22:00',
    }, now)

    expect(plan.days.map(day => day.stage)).toEqual(['arrival', 'postArrival'])
    expect(plan.days[0]?.guidance.sleep).toMatchObject({ key: 'guidance.sleepOpportunity', params: { bedtime: '23:00', wakeTime: '07:00' } })
  })

  it('avoids precise light timing for a large timezone change', () => {
    const plan = generatePlan({
      ...trip,
      destinationTimeZone: 'Asia/Tokyo',
      arrivalLocal: '2027-06-11T22:00',
    }, now)
    expect(plan.limitations.some(note => note.key === 'guidance.lightLimitation')).toBe(true)
    expect(plan.days.at(-1)?.guidance.light).toEqual({ key: 'guidance.lightUncertain' })
  })

  it('marks a date-line-sized change uncertain', () => {
    const plan = generatePlan({
      ...trip,
      originTimeZone: 'Pacific/Honolulu',
      destinationTimeZone: 'Pacific/Kiritimati',
      departureLocal: '2027-06-10T09:00',
      arrivalLocal: '2027-06-11T15:00',
    }, now)
    expect(plan.direction).toBe('uncertain')
  })

  it('does not offer caffeine when traveler says they do not use it', () => {
    const plan = generatePlan({ ...trip, usesCaffeine: false }, now)
    expect(plan.days.every(day => day.guidance.caffeine === undefined)).toBe(true)
  })
})
