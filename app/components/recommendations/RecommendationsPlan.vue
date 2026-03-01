<template>
  <div class="recommendations-plan">
    <!-- Header with Actions -->
    <div class="plan-header">
      <div class="plan-header-content">
        <h1 class="plan-title">
          Your Personalized Jet Lag Plan
        </h1>
        <p class="plan-subtitle">
          Follow these science-based recommendations to minimize jet lag and adapt quickly to your
          new timezone.
        </p>
      </div>
      <div class="plan-actions">
        <button
          class="btn btn-outline"
          title="Print plan"
          @click="printPlan"
        >
          <span class="btn-icon">🖨️</span>
          <span class="btn-text">Print</span>
        </button>
        <button
          class="btn btn-outline"
          title="Edit inputs"
          @click="editPlan"
        >
          <span class="btn-icon">✏️</span>
          <span class="btn-text">Edit</span>
        </button>
      </div>
    </div>

    <!-- Overview Card -->
    <OverviewCard :plan="plan" />

    <!-- Timeline Visualization -->
    <TimelineVisualization :plan="plan" />

    <!-- Pre-Travel Phase -->
    <section
      v-if="plan.preTravel.length > 0"
      class="phase-section"
    >
      <div class="phase-header">
        <h2 class="phase-title">
          <span class="phase-icon">📅</span>
          Pre-Travel Preparation
        </h2>
        <p class="phase-description">
          Start adjusting your schedule {{ plan.preTravel.length }} day{{
            plan.preTravel.length === 1 ? '' : 's'
          }}
          before departure
        </p>
      </div>
      <div class="timeline-container">
        <DailyTimeline
          v-for="(day, index) in plan.preTravel"
          :key="`pre-${index}`"
          :recommendation="day"
          :timezone="plan.homeTimezone"
          phase="pre-travel"
        />
      </div>
    </section>

    <!-- Travel Day -->
    <section class="phase-section">
      <div class="phase-header">
        <h2 class="phase-title">
          <span class="phase-icon">✈️</span>
          Travel Day
        </h2>
        <p class="phase-description">
          Strategies for your journey
        </p>
      </div>
      <TravelDayCard
        :recommendation="plan.travelDay"
        :plan="plan"
      />
    </section>

    <!-- Post-Arrival Phase -->
    <section
      v-if="plan.postArrival.length > 0"
      class="phase-section"
    >
      <div class="phase-header">
        <h2 class="phase-title">
          <span class="phase-icon">🌍</span>
          Post-Arrival Adaptation
        </h2>
        <p class="phase-description">
          Continue adjusting for {{ plan.postArrival.length }} day{{
            plan.postArrival.length === 1 ? '' : 's'
          }}
          at your destination
        </p>
      </div>
      <div class="timeline-container">
        <DailyTimeline
          v-for="(day, index) in plan.postArrival"
          :key="`post-${index}`"
          :recommendation="day"
          :timezone="plan.destinationTimezone"
          phase="post-arrival"
        />
      </div>
    </section>

    <!-- Footer -->
    <div class="plan-footer">
      <div class="disclaimer">
        <h3 class="disclaimer-title">
          Important Information
        </h3>
        <ul class="disclaimer-list">
          <li>
            These recommendations are general wellness guidance and not medical advice. Consult with
            a healthcare provider before starting any new supplement regimen.
          </li>
          <li>
            Individual results may vary. Factors like age, health status, and sleep disorders can
            affect adaptation.
          </li>
          <li>
            Melatonin recommendations assume appropriate use. Follow dosage instructions and consult
            a doctor if you have concerns.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TimelineVisualization from './TimelineVisualization.vue'
import { useRouter } from 'vue-router'
import type { TravelPlan } from '~/types/travel'
import OverviewCard from './OverviewCard.vue'
import DailyTimeline from './DailyTimeline.vue'
import TravelDayCard from './TravelDayCard.vue'

defineProps<{
  plan: TravelPlan
}>()

const router = useRouter()

function printPlan() {
  globalThis.print()
}

function editPlan() {
  router.push({ name: 'plan' })
}
</script>

<style scoped>
.recommendations-plan {
  max-width: 72rem;
  margin: 0 auto;
}

.plan-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
  .plan-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.plan-header-content {
  flex: 1;
}

.plan-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.plan-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.6;
}

.plan-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-outline {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-icon {
  font-size: 1.125rem;
}

.btn-text {
  display: none;
}

@media (min-width: 640px) {
  .btn-text {
    display: inline;
  }
}

.phase-section {
  margin-bottom: 3rem;
}

.phase-header {
  margin-bottom: 1.5rem;
}

.phase-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.phase-icon {
  font-size: 1.75rem;
}

.phase-description {
  font-size: 1rem;
  color: #6b7280;
  margin-left: 2.5rem;
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.plan-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.disclaimer {
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.disclaimer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.75rem;
}

.disclaimer-list {
  list-style: disc;
  padding-left: 1.5rem;
  color: #78350f;
  line-height: 1.6;
}

.disclaimer-list li {
  margin-bottom: 0.5rem;
}

/* Print Styles */
@media print {
  .plan-actions {
    display: none;
  }

  .recommendations-plan {
    max-width: 100%;
  }

  .phase-section {
    page-break-inside: avoid;
  }
}
</style>
