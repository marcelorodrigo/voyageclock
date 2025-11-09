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
} from '@/types/travel'
import { formatTime, parseTime, addDays } from './dateTimeUtils'

// Constants based on circadian rhythm research
const MAX_SHIFT_PER_DAY = 1.5 // hours - maximum comfortable circadian shift
const MIN_SHIFT_PER_DAY = 1 // hours - minimum effective shift
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
  const shiftRate = calculateShiftRate(Math.abs(timezoneOffset), adjustmentDays)

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
      travelDirection,
      shiftRate,
      formData.daysAtDestination,
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

  // For larger differences, use standard rate
  const days = Math.ceil(timezoneOffsetHours / MAX_SHIFT_PER_DAY)
  return Math.min(days, MAX_PRE_TRAVEL_DAYS)
}

/**
 * Calculate the rate of shift per day
 */
function calculateShiftRate(timezoneOffsetHours: number, adjustmentDays: number): number {
  const rate = timezoneOffsetHours / adjustmentDays
  return Math.min(Math.max(rate, MIN_SHIFT_PER_DAY), MAX_SHIFT_PER_DAY)
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
      generalNotes: generatePreTravelNotes(day, direction, Math.abs(timezoneOffset)),
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
 * Generate post-arrival recommendations (days after arrival)
 */
function generatePostArrivalRecommendations(
  formData: TravelFormData,
  departureDate: Date,
  timezoneOffset: number,
  direction: 'east' | 'west',
  shiftRate: number,
  daysAtDestination: number,
): DailyRecommendation[] {
  const recommendations: DailyRecommendation[] = []
  const postArrivalDays = Math.min(
    calculateAdjustmentDays(Math.abs(timezoneOffset)),
    daysAtDestination,
  )

  // Target sleep times in destination timezone
  const targetBedtime = formData.currentBedtime
  const targetWakeTime = formData.currentWakeTime

  for (let day = 1; day <= postArrivalDays; day++) {
    const currentDate = addDays(departureDate, day)

    // Use destination target sleep times
    const adjustedBedtime = targetBedtime
    const adjustedWakeTime = targetWakeTime

    const recommendation: DailyRecommendation = {
      date: currentDate,
      dayNumber: day,
      sleep: {
        bedtime: adjustedBedtime,
        wakeTime: adjustedWakeTime,
        duration: calculateSleepDuration(adjustedBedtime, adjustedWakeTime),
        notes: generatePostArrivalSleepNotes(day, postArrivalDays),
      },
      lightExposure: generateLightExposureWindows(adjustedWakeTime, direction),
      lightAvoidance: generateLightAvoidanceWindows(adjustedBedtime, direction),
      exercise: generateExerciseRecommendation(adjustedWakeTime, direction),
      caffeine: generateCaffeineRecommendation(adjustedBedtime),
      melatonin:
        Math.abs(timezoneOffset) >= MELATONIN_THRESHOLD && day <= 3
          ? generateMelatoninRecommendation(adjustedBedtime)
          : undefined,
      meals: generateMealTimingRecommendation(adjustedWakeTime),
      generalNotes: generatePostArrivalNotes(day, Math.abs(timezoneOffset)),
    }

    recommendations.push(recommendation)
  }

  return recommendations
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
 * Generate sleep notes for post-arrival days
 */
function generatePostArrivalSleepNotes(dayNumber: number, totalDays: number): string {
  if (dayNumber === 1) {
    return 'First day at destination. Stick to local time even if tired. No naps longer than 20 minutes before 3 PM.'
  }

  if (dayNumber === totalDays) {
    return 'Final adjustment day. Your circadian rhythm should be well-aligned with local time now.'
  }

  return `Day ${dayNumber} of adjustment. Continue following the local schedule. Light naps (20 min) are OK if needed.`
}

/**
 * Generate general notes for pre-travel phase
 */
function generatePreTravelNotes(
  dayNumber: number,
  direction: 'east' | 'west',
  timezoneOffset: number,
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
 * Generate general notes for post-arrival phase
 */
function generatePostArrivalNotes(dayNumber: number, timezoneOffset: number): string[] {
  const notes: string[] = []

  if (dayNumber === 1) {
    notes.push(
      'Welcome to your destination! The first 24 hours are crucial for adaptation.',
      'Get outside during the recommended light exposure times - this is the #1 priority.',
      'Resist the urge to nap excessively. Power naps (<20 min) are OK if absolutely needed.'
    )
  }

  if (timezoneOffset >= 6) {
    notes.push('Large timezone change - be patient with yourself. Full adaptation takes time.')
  }

  if (dayNumber <= 3) {
    notes.push('Stay well hydrated and eat regular meals at local times.')
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

