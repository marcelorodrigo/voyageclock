import { Temporal } from '@js-temporal/polyfill'
import { createGuidance } from './guidance'
import { validateTrip } from './tripValidation'
import { calculateOffsetChangeHours, getPlanDirection } from './timeZones'
import type { AdaptationPlan, MessageDescriptor, PlanDay, PlanDirection, TripInput } from '~/types/travel'

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

function getTripExplanation(direction: PlanDirection): MessageDescriptor {
  if (direction === 'uncertain') {
    return { key: 'guidance.tripUncertain' }
  }

  if (direction === 'minimal') {
    return { key: 'guidance.tripMinimal' }
  }

  return { key: 'guidance.tripDirectional' }
}

function getPreparationExplanation(direction: PlanDirection): MessageDescriptor {
  if (direction === 'minimal') {
    return { key: 'guidance.preparationMinimal' }
  }

  const movement = direction === 'eastward' ? 'earlier' : 'later'
  return { key: 'guidance.preparationShift', params: { movement: { key: `movements.${movement}` } } }
}

function makeDay(options: {
  date: Temporal.PlainDate
  timeZone: string
  stage: PlanDay['stage']
  label: MessageDescriptor
  bedtime: string
  wakeTime: string
  direction: PlanDirection
  usesCaffeine: boolean
  lightTimingUncertain: boolean
  explanation: MessageDescriptor
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
      label: { key: 'stages.preparation', params: { day: index + 1 } },
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
      label: { key: 'stages.arrival' },
      bedtime: input.usualBedtime,
      wakeTime: input.usualWakeTime,
      direction,
      usesCaffeine: input.usesCaffeine,
      lightTimingUncertain,
      explanation: { key: 'guidance.arrival', params: { explanation } },
    }),
    makeDay({
      date: destinationArrivalDate.add({ days: 1 }),
      timeZone: input.destinationTimeZone,
      stage: 'postArrival',
      label: { key: 'stages.postArrival' },
      bedtime: input.usualBedtime,
      wakeTime: input.usualWakeTime,
      direction,
      usesCaffeine: input.usesCaffeine,
      lightTimingUncertain,
      explanation: { key: 'guidance.postArrival', params: { explanation } },
    }),
  ]

  const limitations: MessageDescriptor[] = [
    ...(daysBeforeDeparture < MAX_PREPARATION_DAYS
      ? [{ key: preparationDays === 1 ? 'guidance.limitedPreparation' : 'guidance.limitedPreparationPlural', params: { count: preparationDays } }]
      : []),
    ...(lightTimingUncertain
      ? [{ key: 'guidance.lightLimitation' }]
      : []),
    ...(direction === 'minimal'
      ? [{ key: 'guidance.minimalLimitation' }]
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
