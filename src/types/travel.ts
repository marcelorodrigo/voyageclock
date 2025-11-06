/**
 * Core types for travel planning and jet lag adaptation
 */

export interface TravelPlan {
  id: string
  userId?: string
  createdAt: Date

  // Input data
  homeTimezone: string
  destinationTimezone: string
  departureDate: Date
  returnDate?: Date

  // Sleep schedule
  currentBedtime: string // HH:mm format
  currentWakeTime: string
  currentSleepDuration: number // hours

  // Calculated data
  timezoneOffset: number // hours
  travelDirection: 'east' | 'west'
  adjustmentDays: number

  // Recommendations
  preTravel: DailyRecommendation[]
  travelDay: TravelDayRecommendation
  postArrival: DailyRecommendation[]
}

export interface DailyRecommendation {
  date: Date
  dayNumber: number // Relative to departure

  sleep: {
    bedtime: string
    wakeTime: string
    duration: number
    notes?: string
  }

  lightExposure: TimeWindow[]
  lightAvoidance: TimeWindow[]

  exercise?: {
    timing: TimeWindow
    intensity: 'low' | 'moderate' | 'high'
    notes?: string
  }

  caffeine?: {
    allowedUntil: string
    recommendations?: string
  }

  melatonin?: {
    timing: string
    dosage?: string
    notes?: string
  }

  meals?: {
    breakfast?: string
    lunch?: string
    dinner?: string
    notes?: string
  }

  generalNotes?: string[]
}

export interface TravelDayRecommendation {
  date: Date
  flightDuration?: number // hours
  sleepStrategy?: string
  lightExposure?: string
  mealTiming?: string
  hydration?: string
  movement?: string
  generalNotes?: string[]
}

export interface TimeWindow {
  start: string // HH:mm format
  end: string
  priority: 'critical' | 'recommended' | 'optional'
  notes?: string
}

export interface TravelFormData {
  homeTimezone: string
  destinationTimezone: string
  departureDate: string // ISO date string
  departureTime: string // HH:mm format
  daysAtDestination: number
  currentBedtime: string // HH:mm format
  currentWakeTime: string // HH:mm format
}

export interface TimezoneOption {
  value: string // IANA timezone identifier
  label: string // Display name
  offset: number // UTC offset in minutes
  region?: string // Geographic region for grouping
}

