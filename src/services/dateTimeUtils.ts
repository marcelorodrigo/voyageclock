/**
 * Utility functions for date and time manipulation
 */

/**
 * Calculate sleep duration in hours from bedtime to wake time
 * @param bedtime Time in HH:mm format (e.g., "23:00")
 * @param wakeTime Time in HH:mm format (e.g., "07:00")
 * @returns Duration in hours (can be fractional)
 */
export function calculateSleepDuration(bedtime: string, wakeTime: string): number {
  const [bedHour = 0, bedMinute = 0] = bedtime.split(':').map(Number)
  const [wakeHour = 0, wakeMinute = 0] = wakeTime.split(':').map(Number)

  const bedMinutes = bedHour * 60 + bedMinute
  let wakeMinutes = wakeHour * 60 + wakeMinute

  // If wake time is earlier in the day than bedtime, it's the next day
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60 // Add 24 hours
  }

  const durationMinutes = wakeMinutes - bedMinutes
  return durationMinutes / 60
}

/**
 * Format a time value to HH:mm format
 * @param hours Hour (0-23)
 * @param minutes Minute (0-59)
 * @returns Formatted time string
 */
export function formatTime(hours: number, minutes: number = 0): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Parse HH:mm time string to hours and minutes
 * @param timeString Time in HH:mm format
 * @returns Object with hours and minutes
 */
export function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours = 0, minutes = 0] = timeString.split(':').map(Number)
  return { hours, minutes }
}

/**
 * Format a date to YYYY-MM-DD format
 * @param date Date object
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format a date in a readable format (e.g., "Jan 15, 2024")
 * @param date Date object or date string
 * @returns Formatted date string
 */
export function formatDateReadable(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Check if a date string is valid
 * @param dateString Date string in YYYY-MM-DD format
 * @returns True if valid
 */
export function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) {
    return false
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return false
  }

  // Verify the date components match the input (no rollover)
  const parts = dateString.split('-').map(Number)
  const year = parts[0] ?? 0
  const month = parts[1] ?? 0
  const day = parts[2] ?? 0
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getUTCDate() === day
}

/**
 * Check if a time string is valid (HH:mm format)
 * @param timeString Time string
 * @returns True if valid
 */
export function isValidTime(timeString: string): boolean {
  const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/
  return timeRegex.test(timeString)
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export function getTodayDate(): string {
  return formatDate(new Date())
}

/**
 * Get minimum allowed date for departure (today)
 * @returns Date string in YYYY-MM-DD format
 */
export function getMinDepartureDate(): string {
  return getTodayDate()
}

/**
 * Combine date and time into a single Date object
 * @param dateString Date in YYYY-MM-DD format
 * @param timeString Time in HH:mm format
 * @returns Combined Date object
 */
export function combineDateTime(dateString: string, timeString: string): Date {
  const [hours = 0, minutes = 0] = timeString.split(':').map(Number)
  const date = new Date(dateString)
  date.setHours(hours, minutes, 0, 0)
  return date
}

/**
 * Add days to a date
 * @param date Base date
 * @param days Number of days to add (can be negative)
 * @returns New date with days added
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Compare two dates (ignoring time)
 * @param date1 First date
 * @param date2 Second date
 * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export function compareDates(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())

  if (d1 < d2) return -1
  if (d1 > d2) return 1
  return 0
}

