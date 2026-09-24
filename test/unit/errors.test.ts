import { describe, expect, it } from 'vitest'
import { AmbiguousLocalTime, DepartureInPast, InvalidTripInput, NonexistentLocalTime } from '../../app/utils/planner/errors'

describe('planner errors', () => {
  it('provides localized message descriptors for local time errors', () => {
    expect(new AmbiguousLocalTime('Departure')).toMatchObject({
      name: 'AmbiguousLocalTime',
      descriptor: { key: 'errors.ambiguousTime', params: { field: 'fields.departure' } },
    })
    expect(new NonexistentLocalTime('Arrival')).toMatchObject({
      name: 'NonexistentLocalTime',
      descriptor: { key: 'errors.nonexistentTime', params: { field: 'fields.arrival' } },
    })
  })

  it('identifies past departures as invalid trip input', () => {
    const error = new DepartureInPast()
    expect(error).toBeInstanceOf(InvalidTripInput)
    expect(error.descriptor).toEqual({ key: 'errors.departureInPast' })
  })
})
