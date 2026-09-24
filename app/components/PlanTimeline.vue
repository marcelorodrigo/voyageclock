<script setup lang="ts">
import type { AdaptationPlan } from '~/types/travel'

defineProps<{ plan: AdaptationPlan }>()
</script>

<template>
  <section class="mt-10" aria-labelledby="plan-heading" aria-live="polite">
    <div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="text-[.73rem] font-extrabold tracking-[.14em] text-green">YOUR PERSONAL TIMELINE</p>
        <h2 id="plan-heading" class="mt-[.4rem] font-display text-[clamp(1.5rem,4vw,2.2rem)]">A gentler shift, one day at a time</h2>
      </div>
      <span class="flex-none rounded-full bg-[#edf3e8] px-[.85rem] py-[.55rem] text-[.8rem] font-bold text-green-dark">{{ plan.direction === 'uncertain' ? 'Large time shift' : `${Math.abs(plan.offsetChangeHours)}h time difference` }}</span>
    </div>

    <div v-if="plan.limitations.length" class="my-4 mb-6 rounded-lg border-l-[3px] border-[#d5a349] bg-[#fbf6e9] p-4 px-5 text-[.9rem]" role="note">
      <strong>A note about your plan</strong>
      <ul class="mt-2 mb-0 pl-5"><li v-for="limitation in plan.limitations" :key="limitation">{{ limitation }}</li></ul>
    </div>

    <ol class="m-0 grid list-none gap-4 p-0">
      <PlanDayCard v-for="day in plan.days" :key="`${day.stage}-${day.date}`" :day="day" />
    </ol>
    <p class="mt-6 text-[.85rem] leading-[1.5] text-muted">This is general wellness information, not medical advice or a diagnosis. Keep your usual sleep needs and personal health in mind.</p>
  </section>
</template>
