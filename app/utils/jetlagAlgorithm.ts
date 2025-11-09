/**
 * Jet Lag Algorithm Engine
 *
 * Core logic for generating personalized adaptation recommendations
 * based on circadian rhythm science and travel parameters.
 *
 * Key Principles:
 * - Light exposure is the most powerful zeitgeber (time cue)
 * - Eastward travel is harder to adapt to (advancing the clock)
 * - Westward travel is easier (delaying the clock)
 * - Gradual adjustment before travel improves outcomes
 * - Rate of adjustment is typically 1-1.5 hours per day
 */

import type {
  TravelPlan,
  DailyRecommendation,
  TravelDayRecommendation,
  TimeWindow,
  TravelFormData,
} from '~/types/travel'
import { formatTime, parseTime, addDays } from './dateTimeUtils'

// Constants based on circadian rhythm research
const MAX_PRE_TRAVEL_DAYS = 7 // maximum days to adjust before travel
const LIGHT_EXPOSURE_DURATION = 2 // hours - recommended bright light exposure
const LIGHT_AVOIDANCE_DURATION = 3 // hours - critical light avoidance period
const MELATONIN_THRESHOLD = 3 // hours - timezone difference to recommend melatonin

/**
 * Generate a complete travel plan with recommendations
 * Note: timezoneOffset should be set by the caller after generation
 */
export function generateTravelPlan(formData: TravelFormData, timezoneOffset: number = 0): TravelPlan {
  const departureDateTime = new Date(`${formData.departureDate}T${formData.departureTime}`)
  const travelDirection = getTravelDirection(timezoneOffset)
  const adjustmentDays = calculateAdjustmentDays(Math.abs(timezoneOffset))

  return {
    id: generatePlanId(),
    createdAt: new Date(),
    homeTimezone: formData.homeTimezone,
    destinationTimezone: formData.destinationTimezone,
    departureDate: departureDateTime,
    currentBedtime: formData.currentBedtime,
    currentWakeTime: formData.currentWakeTime,
    currentSleepDuration: calculateSleepDuration(
      formData.currentBedtime,
      formData.currentWakeTime,
    ),
    timezoneOffset,
    travelDirection,
    adjustmentDays,
    preTravel: generatePreTravelRecommendations(
      formData,
      departureDateTime,
      timezoneOffset,
      travelDirection,
    ),
    travelDay: generateTravelDayRecommendations(
      departureDateTime,
      timezoneOffset,
      travelDirection,
    ),
    postArrival: generatePostArrivalRecommendations(
      formData,
      departureDateTime,
      timezoneOffset,
    ),
  }
}

/**
 * Determine travel direction
 */
function getTravelDirection(timezoneOffset: number): 'east' | 'west' {
  return timezoneOffset > 0 ? 'east' : 'west'
}

/**
 * Calculate number of days needed for adjustment
 */
function calculateAdjustmentDays(timezoneOffsetHours: number): number {
  // For small differences, less adjustment needed
  if (timezoneOffsetHours <= 2) return 1
  if (timezoneOffsetHours <= 4) return 2

  // For larger differences, use standard rate of 1.5 hours per day
  const days = Math.ceil(timezoneOffsetHours / 1.5)
  return Math.min(days, MAX_PRE_TRAVEL_DAYS)
}


/**
 * Calculate sleep duration in hours
 */
function calculateSleepDuration(bedtime: string, wakeTime: string): number {
  const bed = parseTime(bedtime)
  const wake = parseTime(wakeTime)

  const bedMinutes = bed.hours * 60 + bed.minutes
  let wakeMinutes = wake.hours * 60 + wake.minutes

  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60
  }

  return (wakeMinutes - bedMinutes) / 60
}

/**
 * Add hours to a time string, handling day overflow
 */
function addHoursToTime(timeString: string, hoursToAdd: number): string {
  const time = parseTime(timeString)
  let totalMinutes = time.hours * 60 + time.minutes + hoursToAdd * 60

  // Normalize to 24-hour format
  while (totalMinutes < 0) totalMinutes += 24 * 60
  while (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return formatTime(hours, minutes)
}

/**
 * Generate pre-travel recommendations (days before departure)
 */
function generatePreTravelRecommendations(
  formData: TravelFormData,
  departureDate: Date,
  timezoneOffset: number,
  direction: 'east' | 'west',
): DailyRecommendation[] {
  const recommendations: DailyRecommendation[] = []

  // Only generate pre-travel days if offset is significant (>2 hours)
  if (Math.abs(timezoneOffset) <= 2) {
    return recommendations
  }

  // Calculate how many days are available before departure
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const departure = new Date(departureDate)
  departure.setHours(0, 0, 0, 0)
  const daysUntilDeparture = Math.floor((departure.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Don't generate pre-travel recommendations if trip is today
  if (daysUntilDeparture <= 0) {
    return recommendations
  }

  // Calculate optimal number of pre-travel days (max 5 days as per requirements)
  const idealPreTravelDays = calculateAdjustmentDays(Math.abs(timezoneOffset))
  const MAX_ALLOWED_PRE_TRAVEL_DAYS = 5
  const preTravelDays = Math.min(idealPreTravelDays, daysUntilDeparture, MAX_ALLOWED_PRE_TRAVEL_DAYS)

  // Calculate actual shift rate based on available days
  const totalShiftNeeded = Math.abs(timezoneOffset)
  const actualShiftRate = preTravelDays > 0 ? totalShiftNeeded / preTravelDays : 0

  for (let day = -preTravelDays; day < 0; day++) {
    const currentDate = addDays(departureDate, day)
    const daysFromStart = preTravelDays + day // 0-indexed from first adjustment day

    // Calculate cumulative shift - gradually adjust towards destination time
    const cumulativeShift = (daysFromStart + 1) * actualShiftRate
    const shiftDirection = direction === 'east' ? -1 : 1 // East = go to bed earlier (negative), West = later (positive)

    const adjustedBedtime = addHoursToTime(
      formData.currentBedtime,
      shiftDirection * cumulativeShift,
    )
    const adjustedWakeTime = addHoursToTime(
      formData.currentWakeTime,
      shiftDirection * cumulativeShift,
    )

    const recommendation: DailyRecommendation = {
      date: currentDate,
      dayNumber: day,
      sleep: {
        bedtime: adjustedBedtime,
        wakeTime: adjustedWakeTime,
        duration: calculateSleepDuration(adjustedBedtime, adjustedWakeTime),
        notes: generateSleepNotes(day, direction, actualShiftRate),
      },
      lightExposure: generateLightExposureWindows(adjustedWakeTime, direction),
      lightAvoidance: generateLightAvoidanceWindows(adjustedBedtime, direction),
      exercise: generateExerciseRecommendation(adjustedWakeTime, direction),
      caffeine: generateCaffeineRecommendation(adjustedBedtime),
      melatonin:
        Math.abs(timezoneOffset) >= MELATONIN_THRESHOLD
          ? generateMelatoninRecommendation(adjustedBedtime)
          : undefined,
      generalNotes: generatePreTravelNotes(day, direction),
    }

    recommendations.push(recommendation)
  }

  return recommendations
}

/**
 * Generate travel day recommendations (during flight)
 */
function generateTravelDayRecommendations(
  departureDate: Date,
  timezoneOffset: number,
  direction: 'east' | 'west',
): TravelDayRecommendation {
  return {
    date: departureDate,
    sleepStrategy: generateFlightSleepStrategy(timezoneOffset, direction),
    lightExposure: generateFlightLightStrategy(direction),
    mealTiming: generateFlightMealStrategy(),
    hydration: 'Drink water regularly (8oz every 2 hours). Avoid excessive alcohol and caffeine.',
    movement:
      'Stand and walk every 2 hours. Do seated stretches. This helps circulation and reduces jet lag.',
    generalNotes: generateTravelDayNotes(timezoneOffset),
  }
}

/**
 * Generate post-arrival recommendations (day 1 at destination)
 * Day 1 focuses on resuming normal daily life according to scheduled bedtime parameters
 */
function generatePostArrivalRecommendations(
  formData: TravelFormData,
  departureDate: Date,
  timezoneOffset: number,
): DailyRecommendation[] {
  const recommendations: DailyRecommendation[] = []

  // Only generate Day 1 recommendation
  const arrivalDate = addDays(departureDate, 1)

  // Use normal sleep schedule at destination
  const targetBedtime = formData.currentBedtime
  const targetWakeTime = formData.currentWakeTime

  const recommendation: DailyRecommendation = {
    date: arrivalDate,
    dayNumber: 1,
    sleep: {
      bedtime: targetBedtime,
      wakeTime: targetWakeTime,
      duration: calculateSleepDuration(targetBedtime, targetWakeTime),
      notes: 'First day at destination. Resume your normal sleep schedule according to local time. Avoid naps longer than 20 minutes if needed.',
    },
    lightExposure: generateArrivalDayLightExposure(targetWakeTime),
    lightAvoidance: generateArrivalDayLightAvoidance(targetBedtime),
    exercise: generateArrivalDayExercise(targetWakeTime),
    caffeine: generateCaffeineRecommendation(targetBedtime),
    melatonin:
      Math.abs(timezoneOffset) >= MELATONIN_THRESHOLD
        ? generateMelatoninRecommendation(targetBedtime)
        : undefined,
    meals: generateMealTimingRecommendation(targetWakeTime),
    generalNotes: generateArrivalDayNotes(Math.abs(timezoneOffset)),
  }

  recommendations.push(recommendation)

  return recommendations
}

/**
 * Generate light exposure for arrival day (Day 1)
 */
function generateArrivalDayLightExposure(wakeTime: string): TimeWindow[] {
  const morningStart = addHoursToTime(wakeTime, 0.5)
  const morningEnd = addHoursToTime(morningStart, 2)

  return [
    {
      start: morningStart,
      end: morningEnd,
      priority: 'critical',
      notes: 'Get bright light exposure early in the day. Go outside, open curtains, or spend time in well-lit areas. This helps synchronize your body clock to local time.',
    },
  ]
}

/**
 * Generate light avoidance for arrival day (Day 1)
 */
function generateArrivalDayLightAvoidance(bedtime: string): TimeWindow[] {
  const avoidanceStart = addHoursToTime(bedtime, -2)

  return [
    {
      start: avoidanceStart,
      end: bedtime,
      priority: 'recommended',
      notes: 'Dim lights in the evening, reduce screen brightness, and create a relaxing environment to prepare for sleep at your normal local bedtime.',
    },
  ]
}

/**
 * Generate exercise recommendation for arrival day (Day 1)
 */
function generateArrivalDayExercise(wakeTime: string): DailyRecommendation['exercise'] {
  const startTime = addHoursToTime(wakeTime, 2)
  const endTime = addHoursToTime(startTime, 1)

  return {
    timing: {
      start: startTime,
      end: endTime,
      priority: 'recommended',
    },
    intensity: 'moderate',
    notes: 'Light to moderate exercise helps your body adjust. Take a walk, do some stretching, or engage in gentle activities. Avoid intense exercise if you feel very fatigued.',
  }
}

/**
 * Generate general notes for arrival day (Day 1)
 */
function generateArrivalDayNotes(timezoneOffset: number): string[] {
  const notes: string[] = [
    'Welcome to your destination! Today is about establishing your normal routine in local time.',
    'Follow your regular sleep schedule - go to bed and wake up at your usual times (in local time).',
    'Get outside and stay active during daylight hours to help your body adjust.',
  ]

  if (timezoneOffset >= 6) {
    notes.push('Large time difference - you may feel tired, but try to stay awake until your normal bedtime.')
  }

  notes.push(
    'Eat meals at normal local times and stay well hydrated.',
    'If you need a nap, keep it short (20 minutes max) and before 3 PM local time.'
  )

  return notes
}

/**
 * Generate light exposure windows (seeking bright light)
 */
function generateLightExposureWindows(
  wakeTime: string,
  direction: 'east' | 'west',
): TimeWindow[] {
  if (direction === 'east') {
    // For eastward: morning light advances the clock
    const startTime = addHoursToTime(wakeTime, 0.5) // 30 min after waking
    const endTime = addHoursToTime(startTime, LIGHT_EXPOSURE_DURATION)

    return [
      {
        start: startTime,
        end: endTime,
        priority: 'critical',
        notes:
          'Seek bright light immediately. Go outside, open curtains, or use a light therapy lamp (10,000 lux).',
      },
    ]
  } else {
    // For westward: evening light delays the clock
    const startTime = addHoursToTime(wakeTime, 10) // Late afternoon/evening
    const endTime = addHoursToTime(startTime, LIGHT_EXPOSURE_DURATION)

    return [
      {
        start: startTime,
        end: endTime,
        priority: 'critical',
        notes:
          'Seek bright light in the evening. Stay outdoors, use bright indoor lighting, or light therapy.',
      },
    ]
  }
}

/**
 * Generate light avoidance windows (avoiding light)
 */
function generateLightAvoidanceWindows(
  bedtime: string,
  direction: 'east' | 'west',
): TimeWindow[] {
  if (direction === 'east') {
    // For eastward: avoid evening/night light
    const startTime = addHoursToTime(bedtime, -LIGHT_AVOIDANCE_DURATION)

    return [
      {
        start: startTime,
        end: bedtime,
        priority: 'critical',
        notes:
          'Dim lights, wear blue-blocking glasses, avoid screens. This helps shift your clock earlier.',
      },
    ]
  } else {
    // For westward: avoid early morning light
    const startTime = addHoursToTime(bedtime, -8) // Before wake time
    const endTime = addHoursToTime(startTime, LIGHT_AVOIDANCE_DURATION)

    return [
      {
        start: startTime,
        end: endTime,
        priority: 'critical',
        notes: 'Keep room dark, use blackout curtains, wear eye mask if awake early.',
      },
    ]
  }
}

/**
 * Generate exercise recommendations
 */
function generateExerciseRecommendation(
  wakeTime: string,
  direction: 'east' | 'west',
): DailyRecommendation['exercise'] {
  if (direction === 'east') {
    // Morning exercise helps advance the clock
    const startTime = addHoursToTime(wakeTime, 1)
    const endTime = addHoursToTime(startTime, 1)

    return {
      timing: {
        start: startTime,
        end: endTime,
        priority: 'recommended',
      },
      intensity: 'moderate',
      notes:
        'Morning exercise combined with light exposure is powerful for advancing your clock. Even a 20-minute walk helps.',
    }
  } else {
    // Evening exercise helps delay the clock
    const startTime = addHoursToTime(wakeTime, 9)
    const endTime = addHoursToTime(startTime, 1)

    return {
      timing: {
        start: startTime,
        end: endTime,
        priority: 'recommended',
      },
      intensity: 'moderate',
      notes: 'Evening exercise helps delay your clock. Aim for moderate intensity, not too vigorous.',
    }
  }
}

/**
 * Generate caffeine recommendations
 */
function generateCaffeineRecommendation(bedtime: string): DailyRecommendation['caffeine'] {
  const cutoffTime = addHoursToTime(bedtime, -6) // 6 hours before bed

  return {
    allowedUntil: cutoffTime,
    recommendations: `Stop caffeine by ${cutoffTime} to ensure it doesn't interfere with sleep. Caffeine has a 5-6 hour half-life.`,
  }
}

/**
 * Generate melatonin recommendations
 */
function generateMelatoninRecommendation(bedtime: string): DailyRecommendation['melatonin'] {
  const timing = addHoursToTime(bedtime, -0.5) // 30 min before bed

  return {
    timing,
    dosage: '0.5-3mg',
    notes:
      'Take low-dose melatonin 30 minutes before your target bedtime. Start with 0.5mg and adjust if needed. Consult your doctor first.',
  }
}

/**
 * Generate meal timing recommendations
 */
function generateMealTimingRecommendation(wakeTime: string): DailyRecommendation['meals'] {
  const breakfast = addHoursToTime(wakeTime, 1)
  const lunch = addHoursToTime(wakeTime, 5)
  const dinner = addHoursToTime(wakeTime, 11)

  return {
    breakfast,
    lunch,
    dinner,
    notes:
      'Eating at local meal times helps entrain your circadian rhythm. Try to eat at destination times immediately.',
  }
}

/**
 * Generate sleep notes for pre-travel days
 */
function generateSleepNotes(dayNumber: number, direction: 'east' | 'west', shiftRate: number): string {
  const daysUntilDeparture = Math.abs(dayNumber)
  const action = direction === 'east' ? 'earlier' : 'later'

  if (daysUntilDeparture === 1) {
    return `Final adjustment day. Go to bed ${action} to match your destination schedule.`
  }

  const formattedShiftRate = shiftRate.toFixed(1)
  return `Shift your sleep ${formattedShiftRate} hours ${action} than usual. This gradual adjustment reduces jet lag.`
}


/**
 * Generate general notes for pre-travel phase
 */
function generatePreTravelNotes(
  dayNumber: number,
  direction: 'east' | 'west',
): string[] {
  const notes: string[] = []
  const daysUntil = Math.abs(dayNumber)

  notes.push(`${daysUntil} day${daysUntil === 1 ? '' : 's'} until departure`)

  if (direction === 'east') {
    notes.push(
      'Eastward travel tip: The key is advancing your clock gradually with morning light and early bedtimes.',
    )
  } else {
    notes.push(
      'Westward travel tip: The key is delaying your clock with evening light and staying up later.',
    )
  }

  if (daysUntil <= 2) {
    notes.push('Almost time to travel! Stay consistent with your adjusted schedule.')
  }

  return notes
}


/**
 * Generate travel day notes
 */
function generateTravelDayNotes(timezoneOffset: number): string[] {
  const notes: string[] = [
    'Travel day! Your main goal is to start thinking in destination time.',
    'Set your watch/phone to destination time as soon as you board.'
  ]

  if (Math.abs(timezoneOffset) >= 6) {
    notes.push('Long-haul flight: strategic sleep on the plane can help. See recommendations below.')
  }

  notes.push('Stay hydrated and move around regularly to reduce travel fatigue.')

  return notes
}

/**
 * Generate flight sleep strategy
 */
function generateFlightSleepStrategy(timezoneOffset: number, direction: 'east' | 'west'): string {
  const absOffset = Math.abs(timezoneOffset)

  if (absOffset <= 3) {
    return 'Short timezone change: Stay awake during the flight if possible, sleep according to destination time.'
  }

  if (direction === 'east') {
    return `Eastward flight: Try to sleep on the plane if it's nighttime at your destination. Use eye mask, earplugs, and neck pillow. Avoid sleep if it's daytime at destination.`
  } else {
    return `Westward flight: Stay awake during the flight if possible. If you must sleep, keep it short (1-2 hours max). Watch movies, read, walk around.`
  }
}

/**
 * Generate flight light strategy
 */
function generateFlightLightStrategy(direction: 'east' | 'west'): string {
  if (direction === 'east') {
    return 'Wear sunglasses during the first half of the flight. Remove them and seek light during the second half as you approach destination morning.'
  } else {
    return 'Keep lights bright during the flight. Read, watch screens. Avoid darkness until close to landing if it will be nighttime.'
  }
}

/**
 * Generate flight meal strategy
 */
function generateFlightMealStrategy(): string {
  return "Eat meals according to destination time, not your home time. Decline meal service if it's not mealtime at your destination. Stay hydrated with water."
}

/**
 * Generate a unique plan ID
 */
function generatePlanId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

