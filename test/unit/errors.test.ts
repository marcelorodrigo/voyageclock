import { describe, expect, it } from 'vitest'
import { AmbiguousLocalTime, DepartureInPast, InvalidTripInput, NonexistentLocalTime } from '../../app/utils/planner/errors'

describe('planner errors', () => {
  it('provides specific names and useful messages for local time errors', () => {
    expect(new AmbiguousLocalTime('Departure')).toMatchObject({ name: 'AmbiguousLocalTime', message: expect.stringContaining('occurs twice') })
    expect(new NonexistentLocalTime('Arrival')).toMatchObject({ name: 'NonexistentLocalTime', message: expect.stringContaining('does not exist') })
  })

  it('identifies past departures as invalid trip input', () => {
    const error = new DepartureInPast()
    expect(error).toBeInstanceOf(InvalidTripInput)
    expect(error.message).toBe('Departure must be in the future.')
  })
})
