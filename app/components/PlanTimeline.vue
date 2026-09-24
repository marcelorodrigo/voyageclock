<script setup lang="ts">
import type { AdaptationPlan } from '~/types/travel'

defineProps<{ plan: AdaptationPlan }>()
const { t } = useI18n()

function message(descriptor: { key: string, params?: Record<string, unknown> }): string {
  const params = Object.fromEntries(Object.entries(descriptor.params ?? {}).map(([key, value]) => [
    key,
    value && typeof value === 'object' && 'key' in value
      ? message(value as { key: string, params?: Record<string, unknown> })
      : value,
  ]))
  return t(descriptor.key, params)
}
</script>

<template>
  <section class="mt-10" aria-labelledby="plan-heading" aria-live="polite">
    <div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="text-[.73rem] font-extrabold tracking-[.14em] text-green">{{ $t('timeline.eyebrow') }}</p>
        <h2 id="plan-heading" class="mt-[.4rem] font-display text-[clamp(1.5rem,4vw,2.2rem)]">{{ $t('timeline.heading') }}</h2>
      </div>
      <span class="flex-none rounded-full bg-[#edf3e8] px-[.85rem] py-[.55rem] text-[.8rem] font-bold text-green-dark">{{ plan.direction === 'uncertain' ? $t('timeline.largeShift') : $t('timeline.timeDifference', { hours: Math.abs(plan.offsetChangeHours) }) }}</span>
    </div>

    <div v-if="plan.limitations.length" class="my-4 mb-6 rounded-lg border-l-[3px] border-[#d5a349] bg-[#fbf6e9] p-4 px-5 text-[.9rem]" role="note">
      <strong>{{ $t('timeline.noteTitle') }}</strong>
      <ul class="mt-2 mb-0 pl-5"><li v-for="limitation in plan.limitations" :key="limitation.key">{{ message(limitation) }}</li></ul>
    </div>

    <ol class="m-0 grid list-none gap-4 p-0">
      <PlanDayCard v-for="day in plan.days" :key="`${day.stage}-${day.date}`" :day="day" />
    </ol>
    <p class="mt-6 text-[.85rem] leading-[1.5] text-muted">{{ $t('timeline.wellness') }}</p>
  </section>
</template>
