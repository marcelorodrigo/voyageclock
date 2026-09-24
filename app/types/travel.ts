export type PlanStage = 'preflight' | 'arrival' | 'postArrival'
export type PlanDirection = 'eastward' | 'westward' | 'minimal' | 'uncertain'

export interface TripInput {
  originTimeZone: string
  destinationTimeZone: string
  departureLocal: string
  arrivalLocal: string
  usualBedtime: string
  usualWakeTime: string
  usesCaffeine: boolean
}

export interface ZonedMoment {
  instant: string
  timeZone: string
}

export interface PlanGuidance {
  sleep: string
  wake: string
  light: string
  caffeine?: string
  explanation: string
}

export interface PlanDay {
  date: string
  timeZone: string
  stage: PlanStage
  label: string
  guidance: PlanGuidance
}

export interface AdaptationPlan {
  originTimeZone: string
  destinationTimeZone: string
  departure: ZonedMoment
  arrival: ZonedMoment
  direction: PlanDirection
  offsetChangeHours: number
  days: PlanDay[]
  limitations: string[]
}
