import { describe, expect, it } from 'vitest'
import { AmbiguousLocalTime, NonexistentLocalTime } from '../../app/utils/planner/errors'
import { formatClockTime, formatInTimeZone, minutesBetweenTimes, resolveLocalDateTime } from '../../app/utils/planner/timeZones'

describe('timeZones', () => {
  it('resolves a local time in an IANA timezone', () => {
    expect(resolveLocalDateTime('2027-03-08T09:30', 'America/New_York', 'Departure').toInstant().toString())
      .toBe('2027-03-08T14:30:00Z')
  })

  it('rejects nonexistent and repeated daylight-saving local times distinctly', () => {
    expect(() => resolveLocalDateTime('2027-03-14T02:30', 'America/New_York', 'Departure')).toThrow(NonexistentLocalTime)
    expect(() => resolveLocalDateTime('2027-11-07T01:30', 'America/New_York', 'Departure')).toThrow(AmbiguousLocalTime)
  })

  it('formats shifted sleep times over midnight', () => {
    expect(formatClockTime('23:15', 30)).toBe('23:45')
    expect(formatClockTime('00:15', -30)).toBe('23:45')
  })

  it('computes overnight sleep opportunity including midnight rollover', () => {
    expect(minutesBetweenTimes('23:00', '07:00')).toBe(480)
    expect(minutesBetweenTimes('08:00', '08:00')).toBe(1440)
  })

  it('formats an instant in the requested timezone', () => {
    expect(formatInTimeZone('2027-03-08T14:30:00Z', 'America/New_York')).toContain('9:30')
  })
})
