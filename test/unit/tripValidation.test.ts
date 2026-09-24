import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'
import { DepartureInPast, InvalidTripInput } from '../../app/utils/planner/errors'
import { validateTrip } from '../../app/utils/planner/tripValidation'
import type { TripInput } from '../../app/types/travel'

const validTrip: TripInput = {
  originTimeZone: 'America/New_York',
  destinationTimeZone: 'Europe/London',
  departureLocal: '2027-06-10T09:00',
  arrivalLocal: '2027-06-10T21:00',
  usualBedtime: '23:00',
  usualWakeTime: '07:00',
  usesCaffeine: true,
}
const now = Temporal.Instant.from('2027-06-01T12:00Z')

describe('validateTrip', () => {
  it('returns resolved moments for valid trip details', () => {
    expect(validateTrip(validTrip, now)).toMatchObject({
      input: validTrip,
      departure: { timeZoneId: 'America/New_York' },
      arrival: { timeZoneId: 'Europe/London' },
    })
  })

  it('rejects arrival before or equal to departure', () => {
    expect(() => validateTrip({ ...validTrip, arrivalLocal: '2027-06-10T14:00' }, now))
      .toThrowError(expect.objectContaining({ descriptor: { key: 'errors.arrivalBeforeDeparture' } }))
  })

  it('rejects a departure in the past', () => {
    expect(() => validateTrip({ ...validTrip, departureLocal: '2027-05-31T09:00', arrivalLocal: '2027-05-31T21:00' }, now))
      .toThrow(DepartureInPast)
  })

  it.each([['01:00', '02:00'], ['23:00', '22:00']])('rejects implausible sleep opportunity %s–%s', (usualBedtime, usualWakeTime) => {
    expect(() => validateTrip({ ...validTrip, usualBedtime, usualWakeTime }, now)).toThrow(InvalidTripInput)
  })

  it('rejects an invalid caffeine preference', () => {
    expect(() => validateTrip({ ...validTrip, usesCaffeine: undefined as unknown as boolean }, now))
      .toThrowError(expect.objectContaining({ descriptor: { key: 'errors.caffeineChoice' } }))
  })
})
