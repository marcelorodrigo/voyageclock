import { Temporal } from '@js-temporal/polyfill'
import { DepartureInPast, InvalidTripInput } from './errors'
import { minutesBetweenTimes, resolveLocalDateTime } from './timeZones'
import type { TripInput } from './types'

export interface ValidatedTrip {
  input: TripInput
  departure: Temporal.ZonedDateTime
  arrival: Temporal.ZonedDateTime
}

function validateClockTime(value: string, field: string): void {
  try {
    Temporal.PlainTime.from(value)
  } catch {
    throw new InvalidTripInput(`${field} must be a valid time.`)
  }
}

export function validateTrip(input: TripInput, now: Temporal.Instant): ValidatedTrip {
  const departure = resolveLocalDateTime(input.departureLocal, input.originTimeZone, 'Departure')
  const arrival = resolveLocalDateTime(input.arrivalLocal, input.destinationTimeZone, 'Arrival')

  if (Temporal.Instant.compare(arrival.toInstant(), departure.toInstant()) <= 0) {
    throw new InvalidTripInput('Arrival must be after departure.')
  }

  if (Temporal.Instant.compare(departure.toInstant(), now) <= 0) {
    throw new DepartureInPast()
  }

  validateClockTime(input.usualBedtime, 'Usual bedtime')
  validateClockTime(input.usualWakeTime, 'Usual wake time')

  const sleepOpportunity = minutesBetweenTimes(input.usualBedtime, input.usualWakeTime)
  if (sleepOpportunity < 240 || sleepOpportunity > 960) {
    throw new InvalidTripInput('Usual sleep schedule should allow between 4 and 16 hours of sleep.')
  }

  if (typeof input.usesCaffeine !== 'boolean') {
    throw new InvalidTripInput('Choose whether you use caffeine.')
  }

  return { input, departure, arrival }
}
