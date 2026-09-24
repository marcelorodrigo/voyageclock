import { Temporal } from '@js-temporal/polyfill'
import { DepartureInPast, InvalidTripInput } from './errors'
import { minutesBetweenTimes, resolveLocalDateTime } from './timeZones'
import type { TripInput } from '~/types/travel'

export interface ValidatedTrip {
  input: TripInput
  departure: Temporal.ZonedDateTime
  arrival: Temporal.ZonedDateTime
}

function validateClockTime(value: string, field: string): void {
  try {
    Temporal.PlainTime.from(value)
  } catch {
    throw new InvalidTripInput('invalidTime', { field })
  }
}

export function validateTrip(input: TripInput, now: Temporal.Instant): ValidatedTrip {
  const departure = resolveLocalDateTime(input.departureLocal, input.originTimeZone, 'Departure')
  const arrival = resolveLocalDateTime(input.arrivalLocal, input.destinationTimeZone, 'Arrival')

  if (Temporal.Instant.compare(arrival.toInstant(), departure.toInstant()) <= 0) {
    throw new InvalidTripInput('arrivalBeforeDeparture')
  }

  if (Temporal.Instant.compare(departure.toInstant(), now) <= 0) {
    throw new DepartureInPast()
  }

  validateClockTime(input.usualBedtime, 'Usual bedtime')
  validateClockTime(input.usualWakeTime, 'Usual wake time')

  const sleepOpportunity = minutesBetweenTimes(input.usualBedtime, input.usualWakeTime)
  if (sleepOpportunity < 240 || sleepOpportunity > 960) {
    throw new InvalidTripInput('sleepDuration')
  }

  if (typeof input.usesCaffeine !== 'boolean') {
    throw new InvalidTripInput('caffeineChoice')
  }

  return { input, departure, arrival }
}
