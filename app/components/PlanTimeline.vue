<script setup lang="ts">
import type { AdaptationPlan, PlanDay } from '../utils/planner/types'

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
  <section class="plan-result" aria-labelledby="plan-heading" aria-live="polite">
    <div class="plan-heading-row">
      <div>
        <p class="eyebrow">YOUR PERSONAL TIMELINE</p>
        <h2 id="plan-heading">A gentler shift, one day at a time</h2>
      </div>
      <span class="direction-pill">{{ plan.direction === 'uncertain' ? 'Large time shift' : `${Math.abs(plan.offsetChangeHours)}h time difference` }}</span>
    </div>

    <div v-if="plan.limitations.length" class="limitations" role="note">
      <strong>A note about your plan</strong>
      <ul><li v-for="limitation in plan.limitations" :key="limitation">{{ limitation }}</li></ul>
    </div>

    <ol class="timeline">
      <li v-for="day in plan.days as PlanDay[]" :key="`${day.stage}-${day.date}`" class="timeline-day">
        <span class="timeline-dot" aria-hidden="true" />
        <article class="day-card">
          <div class="day-meta"><span>{{ day.label }}</span><time :datetime="day.date">{{ readableDate(day.date) }}</time></div>
          <p class="zone-label">{{ zoneLabel(day.timeZone) }} local time</p>
          <div class="recommendations">
            <div class="recommendation"><span class="rec-icon" aria-hidden="true">☾</span><p>{{ day.guidance.sleep }} {{ day.guidance.wake }}</p></div>
            <div class="recommendation"><span class="rec-icon" aria-hidden="true">☀</span><p>{{ day.guidance.light }}</p></div>
            <div v-if="day.guidance.caffeine" class="recommendation"><span class="rec-icon" aria-hidden="true">☕</span><p>{{ day.guidance.caffeine }}</p></div>
          </div>
          <p class="day-explanation">{{ day.guidance.explanation }}</p>
        </article>
      </li>
    </ol>
    <p class="medical-note">This is general wellness information, not medical advice or a diagnosis. Keep your usual sleep needs and personal health in mind.</p>
  </section>
</template>

<style scoped>
.plan-result { margin-top: 2.5rem; }
.plan-heading-row { display: flex; justify-content: space-between; align-items: end; gap: 1rem; margin-bottom: 1.5rem; }
.eyebrow { color: var(--green); font-size: .73rem; font-weight: 800; letter-spacing: .14em; }
h2 { margin: .4rem 0 0; font-family: var(--display); font-size: clamp(1.5rem, 4vw, 2.2rem); }
.direction-pill { flex: none; padding: .55rem .85rem; border-radius: 99px; background: #edf3e8; color: var(--green-dark); font-size: .8rem; font-weight: 700; }
.limitations { margin: 1rem 0 1.5rem; padding: 1rem 1.2rem; border-left: 3px solid #d5a349; border-radius: .5rem; background: #fbf6e9; font-size: .9rem; }
.limitations ul { margin: .5rem 0 0; padding-left: 1.2rem; }
.timeline { display: grid; gap: 1rem; margin: 0; padding: 0; list-style: none; }
.timeline-day { position: relative; padding-left: 1.6rem; }
.timeline-day:not(:last-child)::before { position: absolute; top: 1rem; bottom: -1.2rem; left: .35rem; width: 1px; background: #d8dfd5; content: ''; }
.timeline-dot { position: absolute; top: .65rem; left: 0; z-index: 1; width: .75rem; height: .75rem; border: 2px solid var(--green); border-radius: 50%; background: #fff; }
.day-card { padding: 1.2rem; border: 1px solid #e1e6dc; border-radius: .9rem; background: #fff; }
.day-meta { display: flex; justify-content: space-between; gap: .5rem; color: var(--ink); font-weight: 750; }
.day-meta time, .zone-label { color: var(--muted); font-size: .85rem; }
.zone-label { margin: .35rem 0 1rem; }
.recommendations { display: grid; gap: .7rem; }
.recommendation { display: grid; grid-template-columns: 1.5rem 1fr; gap: .5rem; align-items: start; }
.recommendation p { margin: 0; line-height: 1.5; }
.rec-icon { color: var(--green); font-size: 1.1rem; }
.day-explanation { margin: .9rem 0 0; padding-top: .8rem; border-top: 1px solid #edf0ea; color: var(--muted); font-size: .85rem; line-height: 1.5; }
.medical-note { margin-top: 1.5rem; color: var(--muted); font-size: .85rem; line-height: 1.5; }
@media (max-width: 540px) { .plan-heading-row, .day-meta { align-items: start; flex-direction: column; } }
</style>
