export type PlanStage = 'preflight' | 'arrival' | 'postArrival'
export type PlanDirection = 'eastward' | 'westward' | 'minimal' | 'uncertain'
export interface MessageDescriptor {
  key: string
  params?: Record<string, string | number | MessageDescriptor>
}

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
  sleep: MessageDescriptor
  wake: MessageDescriptor
  light: MessageDescriptor
  caffeine?: MessageDescriptor
  explanation: MessageDescriptor
}

export interface PlanDay {
  date: string
  timeZone: string
  stage: PlanStage
  label: MessageDescriptor
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
  limitations: MessageDescriptor[]
}
