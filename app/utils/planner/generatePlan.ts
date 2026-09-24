import { Temporal } from '@js-temporal/polyfill'
import { createGuidance } from './guidance'
import { validateTrip } from './tripValidation'
import { calculateOffsetChangeHours, getPlanDirection } from './timeZones'
import type { AdaptationPlan, PlanDay, PlanDirection, TripInput } from '~/types/travel'

const MAX_PREPARATION_DAYS = 3
const SHIFT_PER_DAY_MINUTES = 30

function getDateDifference(start: Temporal.PlainDate, end: Temporal.PlainDate): number {
  return start.until(end, { largestUnit: 'day' }).days
}

function getShiftSign(direction: PlanDirection): number {
  if (direction === 'eastward') return -1
  if (direction === 'westward') return 1
  return 0
}

function getTripExplanation(direction: PlanDirection): string {
  if (direction === 'uncertain') {
    return 'This trip crosses a date-line-sized offset change, so a simple east/west adaptation direction could be misleading.'
  }

  if (direction === 'minimal') {
    return 'The timezone difference is small, so a major sleep shift may not be useful.'
  }

  return 'Circadian timing varies between people; these gradual schedule changes are estimates, not a measurement of your body clock.'
}

function getPreparationExplanation(direction: PlanDirection): string {
  if (direction === 'minimal') {
    return 'Keep your usual sleep schedule today; the timezone difference is small and does not call for a 30-minute shift.'
  }

  const movement = direction === 'eastward' ? 'earlier' : 'later'
  return `Move the schedule by about 30 minutes ${movement} today. Keep your normal sleep opportunity; do not cut sleep short to follow the plan.`
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
  const offsetChangeHours = calculateOffsetChangeHours(departure, arrival)
  const direction = getPlanDirection(offsetChangeHours)
  const lightTimingUncertain = direction === 'uncertain' || Math.abs(offsetChangeHours) > 6
  const nowAtOrigin = now.toZonedDateTimeISO(input.originTimeZone).toPlainDate()
  const daysBeforeDeparture = getDateDifference(nowAtOrigin, departure.toPlainDate())
  const preparationDays = Math.min(MAX_PREPARATION_DAYS, Math.max(0, daysBeforeDeparture))
  const sign = getShiftSign(direction)
  const explanation = getTripExplanation(direction)
  const preparationExplanation = getPreparationExplanation(direction)

  const preparationPlanDays = Array.from({ length: preparationDays }, (_, index) => {
    const daysUntilDeparture = preparationDays - index
    const date = departure.toPlainDate().subtract({ days: daysUntilDeparture })
    const shiftMinutes = (index + 1) * SHIFT_PER_DAY_MINUTES * sign
    const bedtime = Temporal.PlainTime.from(input.usualBedtime).add({ minutes: shiftMinutes }).toString({ smallestUnit: 'minute' })
    const wakeTime = Temporal.PlainTime.from(input.usualWakeTime).add({ minutes: shiftMinutes }).toString({ smallestUnit: 'minute' })
    return makeDay({
      date,
      timeZone: input.originTimeZone,
      stage: 'preflight',
      label: `Preparation day ${index + 1}`,
      bedtime,
      wakeTime,
      direction,
      usesCaffeine: input.usesCaffeine,
      lightTimingUncertain,
      explanation: preparationExplanation,
    })
  })

  const destinationArrivalDate = arrival.toPlainDate()
  const days: PlanDay[] = [
    ...preparationPlanDays,
    makeDay({
      date: destinationArrivalDate,
      timeZone: input.destinationTimeZone,
      stage: 'arrival',
      label: 'Arrival day',
      bedtime: input.usualBedtime,
      wakeTime: input.usualWakeTime,
      direction,
      usesCaffeine: input.usesCaffeine,
      lightTimingUncertain,
      explanation: `${explanation} Follow destination-local clock times and use these suggestions only where they fit safely with the flight and your sleep needs.`,
    }),
    makeDay({
      date: destinationArrivalDate.add({ days: 1 }),
      timeZone: input.destinationTimeZone,
      stage: 'postArrival',
      label: 'Day after arrival',
      bedtime: input.usualBedtime,
      wakeTime: input.usualWakeTime,
      direction,
      usesCaffeine: input.usesCaffeine,
      lightTimingUncertain,
      explanation: `${explanation} A consistent local sleep and wake schedule supports adjustment.`,
    }),
  ]

  const limitations = [
    ...(daysBeforeDeparture < MAX_PREPARATION_DAYS
      ? [`Only ${preparationDays} preflight preparation day${preparationDays === 1 ? ' is' : 's are'} available; the plan does not make up missed days with larger shifts.`]
      : []),
    ...(lightTimingUncertain
      ? ['Precise light seek/avoid times are not estimated for this timezone change because biological circadian phase is unknown.']
      : []),
    ...(direction === 'minimal'
      ? ['The estimated timezone difference is under one hour; focus on adequate sleep and local routine rather than a major shift.']
      : []),
  ]

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
