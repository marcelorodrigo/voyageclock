<template>
  <EducationLayout
    icon="✈️"
    title="Travel Day Tips"
    subtitle="Practical strategies for managing long flights and minimizing jet lag on your journey"
    icon-bg-class="bg-red-100"
    :related-topics="relatedTopics"
  >
    <h2>Before You Leave Home</h2>

    <h3>Final Preparations (24 Hours Before)</h3>
    <ul>
      <li>
        <strong>Get a good night's sleep:</strong> Don't sacrifice sleep for last-minute packing
      </li>
      <li>
        <strong>Stay hydrated:</strong> Begin increasing water intake
      </li>
      <li>
        <strong>Set your watch:</strong> Change to destination time to start mental adjustment
      </li>
      <li>
        <strong>Pack essentials in carry-on:</strong> Sleep aids, medications, change of clothes
      </li>
    </ul>

    <h2>During the Flight</h2>

    <h3>The Golden Rule</h3>
    <p>
      <strong>Sleep when it's nighttime at your destination, stay awake when it's daytime there.</strong>
      This single principle, if followed, can dramatically reduce jet lag.
    </p>

    <h3>For Flights Where You Need to Sleep</h3>
    <ul>
      <li>Put on eye mask and earplugs as soon as you want to sleep</li>
      <li>Close window shade completely</li>
      <li>Avoid alcohol (disrupts sleep quality)</li>
      <li>Skip the in-flight meal if it's not destination mealtime</li>
    </ul>

    <h3>For Flights Where You Need to Stay Awake</h3>
    <ul>
      <li>Keep window shade open (expose yourself to light)</li>
      <li>Engage with entertainment (movies, games, reading)</li>
      <li>Get up and walk every hour</li>
      <li>Use caffeine strategically</li>
    </ul>

    <h2>Arrival at Destination</h2>

    <h3>If You Arrive in the Morning/Daytime</h3>
    <ul>
      <li><strong>Get outside immediately:</strong> Bright light exposure is crucial</li>
      <li><strong>Don't go to hotel room:</strong> Too tempting to nap</li>
      <li><strong>Stay active:</strong> Walk around, explore, sightsee</li>
      <li><strong>Eat breakfast:</strong> On local schedule, even if not hungry</li>
    </ul>

    <h3>If You Arrive in the Evening/Night</h3>
    <ul>
      <li><strong>Go to hotel and sleep:</strong> Perfect timing</li>
      <li><strong>Light dinner:</strong> Don't skip, but keep it light</li>
      <li><strong>Avoid bright light:</strong> Dim hotel lights, no screens</li>
      <li><strong>Set alarm:</strong> Wake at appropriate destination time</li>
    </ul>

    <h2>Common Mistakes to Avoid</h2>
    <ul>
      <li>
        <strong>Drinking alcohol to sleep:</strong> Reduces sleep quality, worsens dehydration
      </li>
      <li>
        <strong>Napping immediately upon arrival:</strong> "Just 20 minutes" often becomes 3 hours
      </li>
      <li>
        <strong>Staying indoors first day:</strong> Miss crucial light exposure opportunity
      </li>
      <li>
        <strong>Not preparing carry-on:</strong> Missing essential comfort/sleep items
      </li>
    </ul>

    <blockquote>
      <strong>Key Takeaway:</strong> The travel day itself is crucial for jet lag management. Sleep
      when it's nighttime at your destination, stay awake when it's daytime there, stay hydrated,
      and set yourself up for success upon arrival.
    </blockquote>
  </EducationLayout>
</template>

<script setup lang="ts">
import EducationLayout from '@/components/education/EducationLayout.vue'
import type { RelatedTopic } from '@/types/relatedTopic'

const relatedTopics: RelatedTopic[] = [
  {
    path: '/learn/sleep-strategies',
    icon: '😴',
    title: 'Sleep Strategies',
    description: 'Learn optimal sleep timing before, during, and after your flight',
  },
  {
    path: '/learn/nutrition-supplements',
    icon: '🍽️',
    title: 'Nutrition & Supplements',
    description: 'Meal timing and hydration strategies for travel day',
  },
]
</script>
