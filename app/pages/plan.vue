<script setup lang="ts">
import { ref } from 'vue'
import TripPlannerForm from '../components/TripPlannerForm.vue'
import PlanTimeline from '../components/PlanTimeline.vue'
import type { AdaptationPlan } from '../utils/planner/types'

useSeoMeta({
  title: 'Plan your timezone shift — VoyageClock',
  description: 'Create a personal sleep, light, and caffeine timeline for your next trip.',
})

const plan = ref<AdaptationPlan>()
</script>

<template>
  <div class="plan-page">
    <section class="page-intro"><p class="eyebrow">YOUR JOURNEY, IN RHYTHM</p><h1>Let’s plan a softer landing.</h1><p>Tell us when you’re going and how you usually sleep. We’ll map out a gentle adjustment around your trip.</p></section>
    <section class="planner-card" aria-labelledby="trip-details-heading">
      <div class="card-heading"><span class="step-number">01</span><div><h2 id="trip-details-heading">A few details about your trip</h2><p>Times are local to each place. You can change the suggested home timezone.</p></div></div>
      <TripPlannerForm @planned="plan = $event" />
    </section>
    <PlanTimeline v-if="plan" :plan="plan" />
    <aside class="science-callout"><span aria-hidden="true">✳</span><p><strong>Why light timing matters</strong> Light shifts your internal clock differently depending on when your body receives it. We’ll avoid precise light windows when we can’t estimate your biological timing with confidence.</p><NuxtLink to="/science">Read about the science →</NuxtLink></aside>
  </div>
</template>

<style scoped>
.plan-page { width: min(850px, calc(100% - 3rem)); margin: 0 auto; padding: 3rem 0 1rem; }
.page-intro { max-width: 660px; margin: 0 auto 2rem; text-align: center; }
.eyebrow { color: var(--green); font-size: .72rem; font-weight: 800; letter-spacing: .14em; }
h1, h2 { font-family: var(--display); letter-spacing: -.045em; }
h1 { margin: .55rem 0 .7rem; font-size: clamp(2rem, 5vw, 3rem); }
.page-intro > p:last-child { margin: 0; color: var(--muted); font-size: 1.03rem; line-height: 1.6; }
.planner-card { padding: clamp(1.2rem, 4vw, 2rem); border: 1px solid #e1e6dc; border-radius: 1.1rem; background: #fff; box-shadow: 0 14px 40px #344a3610; }
.card-heading { display: flex; gap: .9rem; align-items: flex-start; margin-bottom: 1.6rem; }
.step-number { display: grid; flex: none; place-items: center; width: 2rem; height: 2rem; border-radius: .65rem; background: #e8f0e5; color: var(--green); font-size: .8rem; font-weight: 800; }
.card-heading h2 { margin: 0; font-size: 1.3rem; letter-spacing: -.03em; }.card-heading p { margin: .4rem 0 0; color: var(--muted); font-size: .88rem; line-height: 1.5; }
.science-callout { display: grid; grid-template-columns: 1.5rem 1fr; gap: .4rem .8rem; margin-top: 2rem; padding: 1.2rem; border-radius: .9rem; background: #edf3e9; color: #41584a; }
.science-callout > span { grid-row: span 2; color: #b18a39; font-size: 1.3rem; }.science-callout p { margin: 0; font-size: .9rem; line-height: 1.55; }.science-callout a { grid-column: 2; color: var(--green-dark); font-size: .86rem; font-weight: 750; text-decoration: none; }
@media (max-width: 560px) { .plan-page { width: min(100% - 2rem, 850px); padding-top: 2rem; }.card-heading h2 { font-size: 1.1rem; } }
</style>
