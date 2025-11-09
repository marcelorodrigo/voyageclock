<template>
  <EducationLayout
    icon="🕐"
    title="Understanding Circadian Rhythms"
    subtitle="Your body's internal 24-hour clock that regulates sleep, alertness, and countless biological processes"
    icon-bg-class="bg-blue-100"
    :related-topics="relatedTopics"
  >
    <h2>What Is a Circadian Rhythm?</h2>
    <p>
      Your circadian rhythm is an internal biological clock that runs on approximately a 24-hour
      cycle. This master clock, located in the suprachiasmatic nucleus (SCN) of your brain's
      hypothalamus, orchestrates the timing of numerous physiological processes throughout your
      body.
    </p>

    <h2>What Does Your Circadian Rhythm Control?</h2>
    <p>Your internal clock influences far more than just your sleep-wake cycle:</p>
    <ul>
      <li>
        <strong>Sleep-Wake Patterns:</strong> Regulates when you feel sleepy and when you feel
        alert
      </li>
      <li>
        <strong>Body Temperature:</strong> Lowest in early morning, highest in late afternoon
      </li>
      <li>
        <strong>Hormone Production:</strong> Cortisol peaks in the morning, melatonin rises at
        night
      </li>
      <li><strong>Metabolism:</strong> Affects digestion, blood sugar regulation, and appetite</li>
      <li>
        <strong>Blood Pressure:</strong> Typically rises during waking hours and dips during sleep
      </li>
      <li><strong>Cognitive Performance:</strong> Affects attention, memory, and reaction time</li>
      <li><strong>Immune Function:</strong> Influences inflammation response and healing</li>
      <li><strong>Mood and Mental Health:</strong> Impacts emotional regulation and mental clarity</li>
    </ul>

    <h2>The Science Behind the Clock</h2>
    <p>
      Your circadian rhythm operates through a complex system of "clock genes" present in nearly
      every cell of your body. These genes produce proteins that accumulate and break down in a
      roughly 24-hour cycle, creating the oscillations that drive your biological rhythms.
    </p>

    <h3>The Role of the SCN</h3>
    <p>
      The suprachiasmatic nucleus acts as your master clock, synchronizing all the peripheral clocks
      throughout your body. It receives direct input from specialized cells in your retina that
      detect light, making light the most powerful synchronizer (or "zeitgeber") of your circadian
      system.
    </p>

    <h2>Why Is It Approximately 24 Hours?</h2>
    <p>
      Interestingly, when humans are isolated from all time cues (light, clocks, schedules), their
      natural circadian rhythm tends to run slightly longer than 24 hours—typically around 24.2
      hours. This is why external cues, especially light, are essential for keeping us synchronized
      with the Earth's 24-hour day.
    </p>

    <h2>Factors That Influence Your Circadian Rhythm</h2>

    <h3>Primary Zeitgebers (Time-Givers)</h3>
    <ul>
      <li>
        <strong>Light:</strong> The most powerful signal, especially blue wavelengths from natural
        daylight
      </li>
      <li><strong>Darkness:</strong> Triggers melatonin production and sleep preparation</li>
      <li><strong>Meal Timing:</strong> Regular eating patterns help reinforce circadian rhythms</li>
      <li>
        <strong>Social Cues:</strong> Regular schedules and social interactions provide timing
        signals
      </li>
      <li><strong>Physical Activity:</strong> Exercise timing can shift your circadian phase</li>
      <li><strong>Temperature:</strong> External temperature changes can influence your clock</li>
    </ul>

    <h3>Factors That Disrupt Circadian Rhythms</h3>
    <ul>
      <li><strong>Travel Across Time Zones:</strong> Your internal clock doesn't match local time</li>
      <li>
        <strong>Shift Work:</strong> Working during biological nighttime creates chronic misalignment
      </li>
      <li>
        <strong>Irregular Sleep Schedules:</strong> Weekend sleep-ins can create "social jet lag"
      </li>
      <li>
        <strong>Artificial Light at Night:</strong> Screens and bright lights suppress melatonin
      </li>
      <li><strong>Aging:</strong> Circadian amplitude tends to decrease with age</li>
      <li>
        <strong>Certain Medications:</strong> Some drugs can affect sleep-wake timing or melatonin
        production
      </li>
    </ul>

    <h2>Individual Differences: Chronotypes</h2>
    <p>
      Not everyone's circadian rhythm is identical. Your <strong>chronotype</strong> describes your
      natural sleep-wake preference:
    </p>
    <ul>
      <li>
        <strong>Morning Larks (Early Chronotype):</strong> Naturally wake early, peak performance in
        morning
      </li>
      <li>
        <strong>Night Owls (Late Chronotype):</strong> Prefer later bedtimes, peak performance in
        evening
      </li>
      <li>
        <strong>Intermediate Types:</strong> Fall somewhere between the extremes (most common)
      </li>
    </ul>
    <p>
      Chronotypes are partially genetic and can influence how easily you adapt to different time
      zones. Night owls often find westward travel easier, while morning larks may adapt more
      quickly to eastward travel.
    </p>

    <h2>Why Understanding Your Circadian Rhythm Matters for Travel</h2>
    <p>
      When you travel across time zones, your internal circadian rhythm remains on your home
      schedule while the external environment (light, meals, social cues) is now on a different
      schedule. This mismatch is the root cause of jet lag.
    </p>
    <p>
      By understanding how your circadian rhythm works and what influences it, you can strategically
      use light, sleep timing, and other factors to help your body clock shift more quickly to match
      your destination's time zone.
    </p>

    <blockquote>
      <strong>Key Takeaway:</strong> Your circadian rhythm is a powerful biological system that can
      be influenced by external cues, particularly light. Understanding how it works is the first
      step to effectively managing jet lag.
    </blockquote>
  </EducationLayout>
</template>

<script setup lang="ts">
import EducationLayout from '@/components/education/EducationLayout.vue'
import type { RelatedTopic } from '@/types/relatedTopic'

const relatedTopics: RelatedTopic[] = [
  {
    path: '/learn/how-jet-lag-works',
    icon: '🌍',
    title: 'How Jet Lag Works',
    description: 'Understand why crossing time zones causes such disruption to your body',
  },
  {
    path: '/learn/light-exposure',
    icon: '🌞',
    title: 'Light Exposure Science',
    description: 'Learn how to use light strategically to shift your circadian rhythm',
  },
]
</script>
