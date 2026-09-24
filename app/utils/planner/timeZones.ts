import { Temporal } from '@js-temporal/polyfill'
import { AmbiguousLocalTime, InvalidTripInput, NonexistentLocalTime } from './errors'
import type { PlanDirection } from '~/types/travel'

export function calculateOffsetChangeHours(
  departure: Temporal.ZonedDateTime,
  arrival: Temporal.ZonedDateTime,
): number {
  return (arrival.offsetNanoseconds - departure.offsetNanoseconds) / 3_600_000_000_000
}

export function getPlanDirection(offsetChangeHours: number): PlanDirection {
  if (Math.abs(offsetChangeHours) < 1) return 'minimal'
  if (Math.abs(offsetChangeHours) >= 12) return 'uncertain'
  return offsetChangeHours > 0 ? 'eastward' : 'westward'
}

export function resolveLocalDateTime(value: string, timeZone: string, field: string): Temporal.ZonedDateTime {
  let local: Temporal.PlainDateTime

  try {
    local = Temporal.PlainDateTime.from(value)
  } catch {
    throw new InvalidTripInput('invalidDateTime', { field })
  }

  try {
    return local.toZonedDateTime(timeZone, { disambiguation: 'reject' })
  } catch (error) {
    if (error instanceof RangeError) {
      let earlier: Temporal.ZonedDateTime
      let later: Temporal.ZonedDateTime
      try {
        earlier = local.toZonedDateTime(timeZone, { disambiguation: 'earlier' })
        later = local.toZonedDateTime(timeZone, { disambiguation: 'later' })
      } catch {
        throw new InvalidTripInput('invalidTimezone', { field })
      }

      if (Temporal.PlainDateTime.compare(earlier.toPlainDateTime(), local) !== 0
        || Temporal.PlainDateTime.compare(later.toPlainDateTime(), local) !== 0) {
        throw new NonexistentLocalTime(field)
      }

      if (Temporal.Instant.compare(earlier.toInstant(), later.toInstant()) !== 0) {
        throw new AmbiguousLocalTime(field)
      }

      throw new InvalidTripInput('invalidTimezone', { field })
    }

    throw error
  }
}

export function formatClockTime(time: string, shiftMinutes = 0): string {
  const [hours, minutes] = time.split(':').map(Number)
  const shifted = (hours * 60 + minutes + shiftMinutes + 1440) % 1440
  return `${String(Math.floor(shifted / 60)).padStart(2, '0')}:${String(shifted % 60).padStart(2, '0')}`
}

export function formatInTimeZone(instant: string, timeZone: string, locale = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone,
  }).format(new Date(Temporal.Instant.from(instant).epochMilliseconds))
}

export function minutesBetweenTimes(start: string, end: string): number {
  const [startHours, startMinutes] = start.split(':').map(Number)
  const [endHours, endMinutes] = end.split(':').map(Number)
  const difference = (endHours * 60 + endMinutes - startHours * 60 - startMinutes + 1440) % 1440
  return difference || 1440
}
