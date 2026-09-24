import { Temporal } from '@js-temporal/polyfill'
import { createGuidance } from './guidance'
import { validateTrip } from './tripValidation'
import type { AdaptationPlan, PlanDay, PlanDirection, TripInput } from './types'

const MAX_PREPARATION_DAYS = 3
const SHIFT_PER_DAY_MINUTES = 30

function getDirection(offsetChangeHours: number): PlanDirection {
  if (Math.abs(offsetChangeHours) < 1) return 'minimal'
  if (Math.abs(offsetChangeHours) >= 12) return 'uncertain'
  return offsetChangeHours > 0 ? 'eastward' : 'westward'
}

function getDateDifference(start: Temporal.PlainDate, end: Temporal.PlainDate): number {
  return start.until(end, { largestUnit: 'day' }).days
}

function makeDay(options: {
  date: Temporal.PlainDate
  timeZone: string
  stage: PlanDay['stage']
  label: string
  bedtime: string
  wakeTime: string
  direction: PlanDirection
  usesCaffeine: boolean
  lightTimingUncertain: boolean
  explanation: string
}): PlanDay {
  return {
    date: options.date.toString(),
    timeZone: options.timeZone,
    stage: options.stage,
    label: options.label,
    guidance: createGuidance({
      bedtime: options.bedtime,
      wakeTime: options.wakeTime,
      direction: options.direction,
      stage: options.stage === 'preflight' ? 'preflight' : 'destination',
      usesCaffeine: options.usesCaffeine,
      lightTimingUncertain: options.lightTimingUncertain,
      explanation: options.explanation,
    }),
  }
}

export function generatePlan(input: TripInput, now: Temporal.Instant): AdaptationPlan {
  const { departure, arrival } = validateTrip(input, now)
  const originOffsetMinutes = departure.offsetNanoseconds / 60_000_000_000
  const destinationOffsetMinutes = arrival.offsetNanoseconds / 60_000_000_000
  const offsetChangeHours = (destinationOffsetMinutes - originOffsetMinutes) / 60
  const direction = getDirection(offsetChangeHours)
  const lightTimingUncertain = direction === 'uncertain' || Math.abs(offsetChangeHours) > 6
  const nowAtOrigin = now.toZonedDateTimeISO(input.originTimeZone).toPlainDate()
  const daysBeforeDeparture = getDateDifference(nowAtOrigin, departure.toPlainDate())
  const preparationDays = Math.min(MAX_PREPARATION_DAYS, Math.max(0, daysBeforeDeparture))
  const sign = direction === 'eastward' ? -1 : direction === 'westward' ? 1 : 0
  const totalShift = preparationDays * SHIFT_PER_DAY_MINUTES * sign
  const explanation = direction === 'uncertain'
    ? 'This trip crosses a date-line-sized offset change, so a simple east/west adaptation direction could be misleading.'
    : direction === 'minimal'
      ? 'The timezone difference is small, so a major sleep shift may not be useful.'
      : 'Circadian timing varies between people; these gradual schedule changes are estimates, not a measurement of your body clock.'

  const days: PlanDay[] = []
  for (let index = 0; index < preparationDays; index += 1) {
    const daysUntilDeparture = preparationDays - index
    const date = departure.toPlainDate().subtract({ days: daysUntilDeparture })
    const shiftMinutes = (index + 1) * SHIFT_PER_DAY_MINUTES * sign
    const bedtime = Temporal.PlainTime.from(input.usualBedtime).add({ minutes: shiftMinutes }).toString({ smallestUnit: 'minute' })
    const wakeTime = Temporal.PlainTime.from(input.usualWakeTime).add({ minutes: shiftMinutes }).toString({ smallestUnit: 'minute' })
    days.push(makeDay({
      date,
      timeZone: input.originTimeZone,
      stage: 'preflight',
      label: `Preparation day ${index + 1}`,
      bedtime,
      wakeTime,
      direction,
      usesCaffeine: input.usesCaffeine,
      lightTimingUncertain,
      explanation: `Move the schedule by about 30 minutes ${direction === 'eastward' ? 'earlier' : direction === 'westward' ? 'later' : 'only if comfortable'} today. Keep your normal sleep opportunity; do not cut sleep short to follow the plan.`,
    }))
  }

  const arrivalBedtime = Temporal.PlainTime.from(input.usualBedtime).add({ minutes: totalShift }).toString({ smallestUnit: 'minute' })
  const arrivalWakeTime = Temporal.PlainTime.from(input.usualWakeTime).add({ minutes: totalShift }).toString({ smallestUnit: 'minute' })
  const destinationArrivalDate = arrival.toPlainDate()
  days.push(makeDay({
    date: destinationArrivalDate,
    timeZone: input.destinationTimeZone,
    stage: 'arrival',
    label: 'Arrival day',
    bedtime: arrivalBedtime,
    wakeTime: arrivalWakeTime,
    direction,
    usesCaffeine: input.usesCaffeine,
    lightTimingUncertain,
    explanation: `${explanation} Follow destination-local clock times and use these suggestions only where they fit safely with the flight and your sleep needs.`,
  }))
  days.push(makeDay({
    date: destinationArrivalDate.add({ days: 1 }),
    timeZone: input.destinationTimeZone,
    stage: 'postArrival',
    label: 'Day after arrival',
    bedtime: arrivalBedtime,
    wakeTime: arrivalWakeTime,
    direction,
    usesCaffeine: input.usesCaffeine,
    lightTimingUncertain,
    explanation: `${explanation} A consistent local sleep and wake schedule supports adjustment.`,
  }))

  const limitations: string[] = []
  if (daysBeforeDeparture < MAX_PREPARATION_DAYS) {
    limitations.push(`Only ${preparationDays} preflight preparation day${preparationDays === 1 ? ' is' : 's are'} available; the plan does not make up missed days with larger shifts.`)
  }
  if (lightTimingUncertain) {
    limitations.push('Precise light seek/avoid times are not estimated for this timezone change because biological circadian phase is unknown.')
  }
  if (direction === 'minimal') {
    limitations.push('The estimated timezone difference is under one hour; focus on adequate sleep and local routine rather than a major shift.')
  }

  return {
    originTimeZone: input.originTimeZone,
    destinationTimeZone: input.destinationTimeZone,
    departure: { instant: departure.toInstant().toString(), timeZone: input.originTimeZone },
    arrival: { instant: arrival.toInstant().toString(), timeZone: input.destinationTimeZone },
    direction,
    offsetChangeHours,
    days,
    limitations,
  }
}
