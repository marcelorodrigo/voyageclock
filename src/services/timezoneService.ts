/**
 * Utility functions for working with timezones
 */

import type { TimezoneOption } from '@/types/travel'

/**
 * Get the user's current timezone using Intl API
 */
export function getCurrentTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Get UTC offset for a timezone at a specific date
 * @param timezone IANA timezone identifier
 * @param date Date to check (defaults to now)
 * @returns UTC offset in minutes
 */
export function getTimezoneOffset(timezone: string, date: Date = new Date()): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60)
}

/**
 * Format timezone offset for display
 * @param offsetMinutes UTC offset in minutes
 * @returns Formatted string like "UTC+05:30" or "UTC-08:00"
 */
export function formatTimezoneOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absMinutes = Math.abs(offsetMinutes)
  const hours = Math.floor(absMinutes / 60)
  const minutes = absMinutes % 60
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Get a list of common timezones grouped by region
 */
export function getCommonTimezones(): TimezoneOption[] {
  const timezones = [
    // Americas
    { value: 'America/New_York', label: 'New York', region: 'Americas' },
    { value: 'America/Chicago', label: 'Chicago', region: 'Americas' },
    { value: 'America/Denver', label: 'Denver', region: 'Americas' },
    { value: 'America/Los_Angeles', label: 'Los Angeles', region: 'Americas' },
    { value: 'America/Anchorage', label: 'Anchorage', region: 'Americas' },
    { value: 'Pacific/Honolulu', label: 'Honolulu', region: 'Americas' },
    { value: 'America/Toronto', label: 'Toronto', region: 'Americas' },
    { value: 'America/Vancouver', label: 'Vancouver', region: 'Americas' },
    { value: 'America/Mexico_City', label: 'Mexico City', region: 'Americas' },
    { value: 'America/Sao_Paulo', label: 'São Paulo', region: 'Americas' },
    { value: 'America/Buenos_Aires', label: 'Buenos Aires', region: 'Americas' },

    // Europe
    { value: 'Europe/London', label: 'London', region: 'Europe' },
    { value: 'Europe/Paris', label: 'Paris', region: 'Europe' },
    { value: 'Europe/Berlin', label: 'Berlin', region: 'Europe' },
    { value: 'Europe/Rome', label: 'Rome', region: 'Europe' },
    { value: 'Europe/Madrid', label: 'Madrid', region: 'Europe' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam', region: 'Europe' },
    { value: 'Europe/Stockholm', label: 'Stockholm', region: 'Europe' },
    { value: 'Europe/Athens', label: 'Athens', region: 'Europe' },
    { value: 'Europe/Moscow', label: 'Moscow', region: 'Europe' },
    { value: 'Europe/Istanbul', label: 'Istanbul', region: 'Europe' },

    // Asia
    { value: 'Asia/Dubai', label: 'Dubai', region: 'Asia' },
    { value: 'Asia/Kolkata', label: 'Mumbai/Delhi', region: 'Asia' },
    { value: 'Asia/Bangkok', label: 'Bangkok', region: 'Asia' },
    { value: 'Asia/Singapore', label: 'Singapore', region: 'Asia' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong', region: 'Asia' },
    { value: 'Asia/Shanghai', label: 'Shanghai', region: 'Asia' },
    { value: 'Asia/Tokyo', label: 'Tokyo', region: 'Asia' },
    { value: 'Asia/Seoul', label: 'Seoul', region: 'Asia' },
    { value: 'Asia/Jakarta', label: 'Jakarta', region: 'Asia' },
    { value: 'Asia/Manila', label: 'Manila', region: 'Asia' },

    // Pacific
    { value: 'Australia/Sydney', label: 'Sydney', region: 'Pacific' },
    { value: 'Australia/Melbourne', label: 'Melbourne', region: 'Pacific' },
    { value: 'Australia/Perth', label: 'Perth', region: 'Pacific' },
    { value: 'Pacific/Auckland', label: 'Auckland', region: 'Pacific' },
    { value: 'Pacific/Fiji', label: 'Fiji', region: 'Pacific' },

    // Africa & Middle East
    { value: 'Africa/Cairo', label: 'Cairo', region: 'Africa' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg', region: 'Africa' },
    { value: 'Africa/Lagos', label: 'Lagos', region: 'Africa' },
    { value: 'Africa/Nairobi', label: 'Nairobi', region: 'Africa' },
  ]

  // Add offset to each timezone
  return timezones.map((tz) => ({
    ...tz,
    offset: getTimezoneOffset(tz.value),
  }))
}

/**
 * Calculate time difference in hours between two timezones
 * @param fromTimezone Source timezone
 * @param toTimezone Destination timezone
 * @param date Date to check (defaults to now)
 * @returns Time difference in hours (can be fractional)
 */
export function calculateTimezoneOffset(
  fromTimezone: string,
  toTimezone: string,
  date: Date = new Date(),
): number {
  const fromOffset = getTimezoneOffset(fromTimezone, date)
  const toOffset = getTimezoneOffset(toTimezone, date)
  return (toOffset - fromOffset) / 60
}

/**
 * Determine travel direction based on timezone offset
 * @param timezoneOffset Offset in hours (positive = eastward, negative = westward)
 * @returns Travel direction
 */
export function getTravelDirection(timezoneOffset: number): 'east' | 'west' {
  return timezoneOffset > 0 ? 'east' : 'west'
}
