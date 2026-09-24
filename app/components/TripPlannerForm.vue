<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'
import { generatePlan } from '~/utils/planner/generatePlan'
import type { AdaptationPlan, TripInput } from '~/types/travel'

const props = defineProps<{ now?: string }>()
const emit = defineEmits<{ planned: [plan: AdaptationPlan] }>()
const fallbackZones = [
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
]
const timeZones = ref([...new Set(['UTC', ...fallbackZones])])
const input = ref<TripInput>({
  originTimeZone: 'UTC',
  destinationTimeZone: 'Europe/London',
  departureLocal: '',
  arrivalLocal: '',
  usualBedtime: '23:00',
  usualWakeTime: '07:00',
  usesCaffeine: true,
})
const error = ref<{ key: string, params?: Record<string, string | number> }>()

onMounted(() => {
  const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const availableZones = typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : fallbackZones
  timeZones.value = [...new Set([detectedZone, 'UTC', ...availableZones])]

  const originTimeZone = detectedZone
  const destinationTimeZone = detectedZone === 'Europe/London' ? 'America/New_York' : 'Europe/London'
  const departureLocal = `${Temporal.Now.plainDateISO().add({ days: 3 }).toString()}T09:00`
  const departureInstant = Temporal.PlainDateTime.from(departureLocal)
    .toZonedDateTime(originTimeZone)
    .toInstant()

  input.value = {
    ...input.value,
    originTimeZone,
    destinationTimeZone,
    departureLocal,
    arrivalLocal: departureInstant.add({ hours: 4 })
      .toZonedDateTimeISO(destinationTimeZone)
      .toPlainDateTime()
      .toString({ smallestUnit: 'minute' }),
  }
})

function submit(): void {
  error.value = undefined
  try {
    const plan = generatePlan(input.value, Temporal.Instant.from(props.now ?? Temporal.Now.instant().toString()))
    emit('planned', plan)
  } catch (error_) {
    const descriptor = error_ && typeof error_ === 'object' && 'descriptor' in error_
      ? error_.descriptor as { key: string, params?: Record<string, string | number> }
      : { key: 'errors.generic' }
    error.value = descriptor
  }
}
</script>

<template>
  <form class="grid gap-6" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>{{ $t('form.origin') }}</span>
        <select v-model="input.originTimeZone" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" required>
          <option v-for="zone in timeZones" :key="`origin-${zone}`" :value="zone">{{ zone.replaceAll('_', ' ') }}</option>
        </select>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>{{ $t('form.destination') }}</span>
        <select v-model="input.destinationTimeZone" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" required>
          <option v-for="zone in timeZones" :key="`destination-${zone}`" :value="zone">{{ zone.replaceAll('_', ' ') }}</option>
        </select>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>{{ $t('form.departure') }}</span>
        <input v-model="input.departureLocal" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" type="datetime-local" required>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>{{ $t('form.arrival') }}</span>
        <input v-model="input.arrivalLocal" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" type="datetime-local" required>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>{{ $t('form.bedtime') }}</span>
        <input v-model="input.usualBedtime" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" type="time" required>
      </label>
      <label class="grid gap-2 text-[.9rem] font-[650] text-ink">
        <span>{{ $t('form.wakeTime') }}</span>
        <input v-model="input.usualWakeTime" class="min-h-12 w-full rounded-[.7rem] border border-[#d8dfd5] bg-white px-[.8rem] py-[.7rem] font-[inherit] text-ink focus:border-green focus:outline-[3px] focus:outline-[#b6d6b0]" type="time" required>
      </label>
    </div>

    <fieldset class="flex flex-wrap gap-[1.2rem] border-0 p-0">
      <legend class="mb-[.7rem] w-full font-bold">{{ $t('form.caffeineQuestion') }}</legend>
      <label class="flex items-center gap-2 text-[.9rem] font-[650] text-ink"><input v-model="input.usesCaffeine" class="size-[1.1rem] accent-green" type="radio" :value="true"> {{ $t('form.yes') }}</label>
      <label class="flex items-center gap-2 text-[.9rem] font-[650] text-ink"><input v-model="input.usesCaffeine" class="size-[1.1rem] accent-green" type="radio" :value="false"> {{ $t('form.no') }}</label>
    </fieldset>

    <p v-if="error" class="m-0 font-[650] text-[#9c3429]" role="alert">{{ $t(error.key, error.params ?? {}) }}</p>
    <button class="inline-flex min-h-[3.2rem] cursor-pointer items-center justify-center gap-3 rounded-xl border-0 bg-green px-5 py-[.8rem] font-bold text-white hover:bg-green-dark" type="submit">{{ $t('form.submit') }} <span aria-hidden="true">→</span></button>
    <p class="-mt-2 mb-0 text-[.82rem] text-muted">{{ $t('form.privacy') }}</p>
  </form>
</template>
