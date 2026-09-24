import type { MessageDescriptor } from '~/types/travel'

const fieldKeys: Record<string, string> = {
  Departure: 'departure',
  Arrival: 'arrival',
  'Usual bedtime': 'bedtime',
  'Usual wake time': 'wakeTime',
}

function getFieldDescriptor(field: string): string {
  if (field.startsWith('fields.')) return field
  return `fields.${fieldKeys[field] ?? field}`
}

export class InvalidTripInput extends Error {
  readonly descriptor: MessageDescriptor

  constructor(key: string, params?: Record<string, string | number>) {
    const translatedParams = params && 'field' in params && typeof params.field === 'string'
      ? { ...params, field: getFieldDescriptor(params.field) }
      : params
    super(key === 'invalidDateTime' || key === 'invalidTime' || key === 'invalidTimezone'
      ? `${key}:${String(params?.field ?? '')}`
      : key)
    this.name = 'InvalidTripInput'
    this.descriptor = { key: `errors.${key}`, ...(translatedParams ? { params: translatedParams } : {}) }
  }
}

export class NonexistentLocalTime extends InvalidTripInput {
  constructor(field: string) {
    super('nonexistentTime', { field })
    this.name = 'NonexistentLocalTime'
  }
}

export class AmbiguousLocalTime extends InvalidTripInput {
  constructor(field: string) {
    super('ambiguousTime', { field })
    this.name = 'AmbiguousLocalTime'
  }
}

export class DepartureInPast extends InvalidTripInput {
  constructor() {
    super('departureInPast')
    this.name = 'DepartureInPast'
  }
}
