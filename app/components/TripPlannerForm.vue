<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'
import { generatePlan } from '~/utils/planner/generatePlan'
import type { AdaptationPlan, TripInput } from '~/types/travel'

const props = defineProps<{ now?: string }>()
const emit = defineEmits<{ planned: [plan: AdaptationPlan] }>()
const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
const fallbackZones = [
  detectedZone,
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
]
const availableZones = typeof Intl.supportedValuesOf === 'function'
  ? Intl.supportedValuesOf('timeZone')
  : fallbackZones
const timeZones = [...new Set([detectedZone, ...availableZones])]
const dateAfter = Temporal.Now.plainDateISO().add({ days: 3 }).toString()
const originTimeZone = detectedZone
const destinationTimeZone = detectedZone === 'Europe/London' ? 'America/New_York' : 'Europe/London'
const departureLocal = `${dateAfter}T09:00`
const departureInstant = Temporal.PlainDateTime.from(departureLocal)
  .toZonedDateTime(originTimeZone)
  .toInstant()
const arrivalLocal = departureInstant.add({ hours: 4 })
  .toZonedDateTimeISO(destinationTimeZone)
  .toPlainDateTime()
  .toString({ smallestUnit: 'minute' })
const input = ref<TripInput>({
  originTimeZone,
  destinationTimeZone,
  departureLocal,
  arrivalLocal,
  usualBedtime: '23:00',
  usualWakeTime: '07:00',
  usesCaffeine: true,
})
const error = ref('')

function submit(): void {
  error.value = ''
  try {
    const plan = generatePlan(input.value, Temporal.Instant.from(props.now ?? Temporal.Now.instant().toString()))
    emit('planned', plan)
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'We could not create this plan. Check your trip details.'
  }
}
</script>

<template>
  <form class="grid gap-6" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>Where are you leaving from?</span>
        <select v-model="input.originTimeZone" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" required>
          <option v-for="zone in timeZones" :key="`origin-${zone}`" :value="zone">{{ zone.replaceAll('_', ' ') }}</option>
        </select>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>Where are you going?</span>
        <select v-model="input.destinationTimeZone" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" required>
          <option v-for="zone in timeZones" :key="`destination-${zone}`" :value="zone">{{ zone.replaceAll('_', ' ') }}</option>
        </select>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>Departure date and local time</span>
        <input v-model="input.departureLocal" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" type="datetime-local" required>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>Arrival date and local time</span>
        <input v-model="input.arrivalLocal" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" type="datetime-local" required>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>Your usual bedtime</span>
        <input v-model="input.usualBedtime" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" type="time" required>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>Your usual wake time</span>
        <input v-model="input.usualWakeTime" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" type="time" required>
      </label>
    </div>

    <fieldset class="flex flex-wrap gap-[1.2rem] border-0 p-0">
      <legend class="mb-[.7rem] w-full font-bold">Do you usually have caffeine?</legend>
      <label class="flex items-center gap-2 text-[.9rem] font-[650] text-ink"><input v-model="input.usesCaffeine" class="size-[1.1rem] accent-green" type="radio" :value="true"> Yes</label>
      <label class="flex items-center gap-2 text-[.9rem] font-[650] text-ink"><input v-model="input.usesCaffeine" class="size-[1.1rem] accent-green" type="radio" :value="false"> No</label>
    </fieldset>

    <p v-if="error" class="m-0 font-[650] text-[#9c3429]" role="alert">{{ error }}</p>
    <button class="inline-flex min-h-[3.2rem] cursor-pointer items-center justify-center gap-3 rounded-xl border-0 bg-green px-5 py-[.8rem] font-bold text-white hover:bg-green-dark" type="submit">Build my adaptation plan <span aria-hidden="true">→</span></button>
    <p class="-mt-2 mb-0 text-[.82rem] text-muted">Your trip details stay in this browser and are not saved to an account.</p>
  </form>
</template>
