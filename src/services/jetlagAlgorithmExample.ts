/**
 * Example usage of the jetlag algorithm
 *
 * This file demonstrates how to use the algorithm engine
 * to generate a travel plan.
 */

import { generateTravelPlan } from '@/services/jetlagAlgorithm'
import type { TravelFormData, TravelPlan } from '@/types/travel'

// Example 1: Eastward travel (harder to adjust)
// New York to London (+5 hours)
const eastwardExample: TravelFormData = {
  homeTimezone: 'America/New_York',
  destinationTimezone: 'Europe/London',
  departureDate: '2025-11-15',
  departureTime: '20:00', // 8 PM departure
  daysAtDestination: 7,
  currentBedtime: '23:00', // 11 PM
  currentWakeTime: '07:00', // 7 AM
}

// Example 2: Westward travel (easier to adjust)
// San Francisco to Tokyo (+16 hours)
const westwardExample: TravelFormData = {
  homeTimezone: 'America/Los_Angeles',
  destinationTimezone: 'Asia/Tokyo',
  departureDate: '2025-12-01',
  departureTime: '11:00', // 11 AM departure
  daysAtDestination: 10,
  currentBedtime: '22:30', // 10:30 PM
  currentWakeTime: '06:30', // 6:30 AM
}

// Example 3: Small timezone difference
// Los Angeles to Denver (+1 hour) - No pre-travel adjustment needed
const smallDifferenceExample: TravelFormData = {
  homeTimezone: 'America/Los_Angeles',
  destinationTimezone: 'America/Denver',
  departureDate: '2025-11-20',
  departureTime: '14:00', // 2 PM
  daysAtDestination: 5,
  currentBedtime: '23:00',
  currentWakeTime: '07:00',
}

/**
 * Generate plans for all examples
 */
export function generateExamplePlans() {
  console.log('=== EASTWARD TRAVEL EXAMPLE ===')
  const eastPlan = generateTravelPlan(eastwardExample)
  console.log('Travel Direction:', eastPlan.travelDirection)
  console.log('Adjustment Days:', eastPlan.adjustmentDays)
  console.log('Pre-Travel Recommendations:', eastPlan.preTravel.length, 'days')
  console.log('Post-Arrival Recommendations:', eastPlan.postArrival.length, 'days')

  if (eastPlan.preTravel.length > 0) {
    const firstDay = eastPlan.preTravel[0]
    console.log('\nFirst Pre-Travel Day:')
    console.log('  Bedtime:', firstDay.sleep.bedtime)
    console.log('  Wake Time:', firstDay.sleep.wakeTime)
    console.log('  Light Exposure:', firstDay.lightExposure[0]?.start, '-', firstDay.lightExposure[0]?.end)
  }

  console.log('\n=== WESTWARD TRAVEL EXAMPLE ===')
  const westPlan = generateTravelPlan(westwardExample)
  console.log('Travel Direction:', westPlan.travelDirection)
  console.log('Adjustment Days:', westPlan.adjustmentDays)

  console.log('\n=== SMALL DIFFERENCE EXAMPLE ===')
  const smallPlan = generateTravelPlan(smallDifferenceExample)
  console.log('Travel Direction:', smallPlan.travelDirection)
  console.log('Pre-Travel Days:', smallPlan.preTravel.length, '(should be 0 for small difference)')

  return { eastPlan, westPlan, smallPlan }
}

/**
 * Example of how to use in a Vue component
 */
export function useInComponent() {
  // In a real component, you would use the travelStore:
  //
  // import { useTravelStore } from '@/stores/travelStore'
  //
  // const travelStore = useTravelStore()
  //
  // // User fills out form...
  // travelStore.updateField('homeTimezone', 'America/New_York')
  // travelStore.updateField('destinationTimezone', 'Europe/London')
  // // ... etc
  //
  // // Generate the plan
  // await travelStore.generatePlan()
  //
  // // Access the generated plan
  // if (travelStore.travelPlan) {
  //   console.log('Plan generated!', travelStore.travelPlan)
  // }
}

/**
 * Example of displaying recommendations
 */
export function displayRecommendations(plan: TravelPlan) {
  console.log('\n=== YOUR TRAVEL PLAN ===\n')

  console.log(`From: ${plan.homeTimezone}`)
  console.log(`To: ${plan.destinationTimezone}`)
  console.log(`Timezone difference: ${Math.abs(plan.timezoneOffset)} hours ${plan.travelDirection}`)
  console.log(`Current sleep: ${plan.currentBedtime} - ${plan.currentWakeTime} (${plan.currentSleepDuration}hrs)`)
  console.log('')

  // Pre-travel phase
  if (plan.preTravel.length > 0) {
    console.log('📅 PRE-TRAVEL ADJUSTMENT')
    console.log('Start adjusting your schedule before departure:')
    plan.preTravel.forEach((day) => {
      const date = day.date.toLocaleDateString()
      console.log(`\n  Day ${day.dayNumber} (${date}):`)
      console.log(`    💤 Sleep: ${day.sleep.bedtime} - ${day.sleep.wakeTime}`)
      console.log(`    ☀️  Light: ${day.lightExposure[0]?.start} - ${day.lightExposure[0]?.end}`)
      console.log(`    🌙 Avoid: ${day.lightAvoidance[0]?.start} - ${day.lightAvoidance[0]?.end}`)
      if (day.melatonin) {
        console.log(`    💊 Melatonin: ${day.melatonin.timing} (${day.melatonin.dosage})`)
      }
    })
  }

  // Travel day
  console.log('\n\n✈️  TRAVEL DAY')
  console.log(`Date: ${plan.travelDay.date.toLocaleDateString()}`)
  console.log(`Sleep: ${plan.travelDay.sleepStrategy}`)
  console.log(`Light: ${plan.travelDay.lightExposure}`)
  console.log(`Meals: ${plan.travelDay.mealTiming}`)

  // Post-arrival
  console.log('\n\n🌍 AT YOUR DESTINATION')
  console.log('Follow local time immediately:')
  plan.postArrival.forEach((day) => {
    const date = day.date.toLocaleDateString()
    console.log(`\n  Day ${day.dayNumber} (${date}):`)
    console.log(`    💤 Sleep: ${day.sleep.bedtime} - ${day.sleep.wakeTime}`)
    console.log(`    ☀️  Light: ${day.lightExposure[0]?.start} - ${day.lightExposure[0]?.end}`)
    console.log(`    🍽️  Meals: ${day.meals?.breakfast}, ${day.meals?.lunch}, ${day.meals?.dinner}`)
    if (day.generalNotes && day.generalNotes.length > 0) {
      console.log(`    📝 Notes: ${day.generalNotes[0]}`)
    }
  })

  console.log('\n\n✅ Plan generated successfully!')
}

// Uncomment to run examples:
// const { eastPlan } = generateExamplePlans()
// displayRecommendations(eastPlan)

