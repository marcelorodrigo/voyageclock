<script setup lang="ts">
import type { AdaptationPlan, PlanDay } from '~/types/travel'

defineProps<{ plan: AdaptationPlan }>()

function readableDate(date: string): string {
  const day = new Date(`${date}T12:00:00Z`)
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(day)
}

function zoneLabel(timeZone: string): string {
  return timeZone.replaceAll('_', ' ')
}
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
      <li v-for="day in plan.days as PlanDay[]" :key="`${day.stage}-${day.date}`" class="relative pl-[1.6rem] before:absolute before:bottom-[-1.2rem] before:left-[.35rem] before:top-4 before:w-px before:bg-[#d8dfd5] before:content-[''] last:before:hidden">
        <span class="absolute left-0 top-[.65rem] z-[1] size-3 rounded-full border-2 border-green bg-white" aria-hidden="true" />
        <article class="rounded-[.9rem] border border-[#e1e6dc] bg-white p-[1.2rem]">
          <div class="flex flex-col justify-between gap-2 font-[750] text-ink sm:flex-row"><span>{{ day.label }}</span><time class="text-[.85rem] font-normal text-muted" :datetime="day.date">{{ readableDate(day.date) }}</time></div>
          <p class="my-[.35rem] mb-4 text-[.85rem] text-muted">{{ zoneLabel(day.timeZone) }} local time</p>
          <div class="grid gap-[.7rem]">
            <div class="grid grid-cols-[1.5rem_1fr] items-start gap-2"><span class="text-[1.1rem] text-green" aria-hidden="true">☾</span><p class="m-0 leading-[1.5]">{{ day.guidance.sleep }} {{ day.guidance.wake }}</p></div>
            <div class="grid grid-cols-[1.5rem_1fr] items-start gap-2"><span class="text-[1.1rem] text-green" aria-hidden="true">☀</span><p class="m-0 leading-[1.5]">{{ day.guidance.light }}</p></div>
            <div v-if="day.guidance.caffeine" class="grid grid-cols-[1.5rem_1fr] items-start gap-2"><span class="text-[1.1rem] text-green" aria-hidden="true">☕</span><p class="m-0 leading-[1.5]">{{ day.guidance.caffeine }}</p></div>
          </div>
          <p class="mt-[.9rem] mb-0 border-t border-[#edf0ea] pt-[.8rem] text-[.85rem] leading-[1.5] text-muted">{{ day.guidance.explanation }}</p>
        </article>
      </li>
    </ol>
    <p class="mt-6 text-[.85rem] leading-[1.5] text-muted">This is general wellness information, not medical advice or a diagnosis. Keep your usual sleep needs and personal health in mind.</p>
  </section>
</template>
