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
 * Check if a date string is valid
 * @param dateString Date string in YYYY-MM-DD format
 * @returns True if valid
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !Number.isNaN(date.getTime())
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

