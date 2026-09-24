<script setup lang="ts">
import { ref } from 'vue'
import { Temporal } from '@js-temporal/polyfill'
import { generatePlan } from '../utils/planner/generatePlan'
import type { AdaptationPlan, TripInput } from '../utils/planner/types'

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
const input = ref<TripInput>({
  originTimeZone: detectedZone,
  destinationTimeZone: detectedZone === 'Europe/London' ? 'America/New_York' : 'Europe/London',
  departureLocal: `${dateAfter}T09:00`,
  arrivalLocal: `${dateAfter}T13:00`,
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
  <form class="planner-form" @submit.prevent="submit">
    <div class="form-grid">
      <label>
        <span>Where are you leaving from?</span>
        <select v-model="input.originTimeZone" required>
          <option v-for="zone in timeZones" :key="`origin-${zone}`" :value="zone">{{ zone.replaceAll('_', ' ') }}</option>
        </select>
      </label>
      <label>
        <span>Where are you going?</span>
        <select v-model="input.destinationTimeZone" required>
          <option v-for="zone in timeZones" :key="`destination-${zone}`" :value="zone">{{ zone.replaceAll('_', ' ') }}</option>
        </select>
      </label>
      <label>
        <span>Departure date and local time</span>
        <input v-model="input.departureLocal" type="datetime-local" required>
      </label>
      <label>
        <span>Arrival date and local time</span>
        <input v-model="input.arrivalLocal" type="datetime-local" required>
      </label>
      <label>
        <span>Your usual bedtime</span>
        <input v-model="input.usualBedtime" type="time" required>
      </label>
      <label>
        <span>Your usual wake time</span>
        <input v-model="input.usualWakeTime" type="time" required>
      </label>
    </div>

    <fieldset>
      <legend>Do you usually have caffeine?</legend>
      <label class="choice"><input v-model="input.usesCaffeine" type="radio" :value="true"> Yes</label>
      <label class="choice"><input v-model="input.usesCaffeine" type="radio" :value="false"> No</label>
    </fieldset>

    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <button class="button button-primary" type="submit">Build my adaptation plan <span aria-hidden="true">→</span></button>
    <p class="form-note">Your trip details stay in this browser and are not saved to an account.</p>
  </form>
</template>

<style scoped>
.planner-form { display: grid; gap: 1.5rem; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
label { display: grid; gap: .5rem; color: var(--ink); font-size: .9rem; font-weight: 650; }
input, select { width: 100%; min-height: 3rem; padding: .7rem .8rem; border: 1px solid #d8dfd5; border-radius: .7rem; background: #fff; color: var(--ink); font: inherit; }
input:focus, select:focus { outline: 3px solid #b6d6b0; border-color: var(--green); }
fieldset { display: flex; flex-wrap: wrap; gap: 1.2rem; border: 0; padding: 0; }
legend { width: 100%; margin-bottom: .7rem; font-weight: 700; }
.choice { display: flex; grid-template-columns: auto 1fr; align-items: center; }
.choice input { width: 1.1rem; min-height: 1.1rem; accent-color: var(--green); }
.form-error { margin: 0; color: #9c3429; font-weight: 650; }
.form-note { margin: -.5rem 0 0; color: var(--muted); font-size: .82rem; }
@media (max-width: 620px) { .form-grid { grid-template-columns: 1fr; } }
</style>
