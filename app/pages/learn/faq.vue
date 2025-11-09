<template>
  <EducationLayout
    icon="❓"
    title="Frequently Asked Questions"
    subtitle="Quick answers to common questions about jet lag, circadian rhythms, and travel health"
    icon-bg-class="bg-gray-100"
    :related-topics="relatedTopics"
  >
    <h2>General Jet Lag Questions</h2>

    <h3>How many time zones do I need to cross to get jet lag?</h3>
    <p>
      Most people begin experiencing jet lag symptoms when crossing <strong>3 or more time zones</strong>.
      Crossing 1-2 zones typically causes minimal disruption. The severity increases with the number
      of zones crossed.
    </p>

    <h3>Why is traveling east harder than traveling west?</h3>
    <p>
      Your natural circadian rhythm runs slightly longer than 24 hours (about 24.2 hours), making it
      easier to <strong>delay</strong> your schedule (westward) than to <strong>advance</strong> it
      (eastward). Additionally, most people find it easier to stay up late than to go to bed and
      wake up early.
    </p>

    <h3>How long does jet lag last?</h3>
    <p>
      A general rule of thumb is about <strong>one day per time zone crossed</strong>, though this
      varies by individual and travel direction. Eastward travel often takes 50% longer to adjust
      than westward. With strategic intervention (light exposure, sleep timing), you can reduce this
      significantly.
    </p>

    <h3>Can I completely prevent jet lag?</h3>
    <p>
      For large time zone changes, you can't completely eliminate jet lag, but you can
      <strong>significantly reduce its severity and duration</strong>. Pre-travel adjustment,
      strategic light exposure, and proper sleep timing can reduce recovery time by 30-50% or more.
    </p>

    <h3>Is jet lag dangerous?</h3>
    <p>
      Jet lag itself is not dangerous for healthy individuals, though it's uncomfortable and reduces
      performance. However, the <strong>disruption to circadian rhythms</strong> in frequent flyers
      may have long-term health implications. Acute risks include impaired judgment, slower reaction
      times (relevant for driving), and increased accident risk.
    </p>

    <h3>Do some people not get jet lag?</h3>
    <p>
      Everyone experiences circadian misalignment when crossing time zones, but
      <strong>individual sensitivity varies widely</strong>. Factors include age, chronotype, overall
      health, stress levels, and previous experience with travel. Some people are simply more
      resilient.
    </p>

    <h2>Light Exposure Questions</h2>

    <h3>Does indoor light work for adjusting my circadian rhythm?</h3>
    <p>
      Indoor lighting (100-500 lux) is much less effective than outdoor daylight (10,000+ lux).
      However, it's better than nothing. For best results, use a <strong>light therapy lamp</strong>
      (10,000 lux) or spend time outside.
    </p>

    <h3>How long do I need to be in bright light?</h3>
    <p>
      <strong>Minimum 20-30 minutes</strong> of bright light (10,000 lux) can shift your circadian
      rhythm. Longer exposure (60-90 minutes) is more effective. The timing is more critical than
      the duration.
    </p>

    <h3>Do sunglasses reduce jet lag by blocking light?</h3>
    <p>
      Sunglasses are useful for <strong>avoiding light at the wrong times</strong>, which is as
      important as seeking light at the right times. However, blocking light when you should be
      getting it will worsen jet lag.
    </p>

    <h3>Do blue light blocking glasses help with jet lag?</h3>
    <p>
      Yes, <strong>amber-tinted glasses that block blue light</strong> can be helpful in the evening
      when you need to avoid light exposure. They're particularly useful for westward travel when
      you need to delay your rhythm, or when you must be in bright environments during your "avoid
      light" windows.
    </p>

    <h3>Can I use my phone or tablet for light therapy?</h3>
    <p>
      Screens emit blue light but at much lower intensity than needed for effective circadian
      shifting. They're <strong>not a substitute for proper light therapy</strong>, but avoiding
      screens before bed can help prevent melatonin suppression.
    </p>

    <h2>Sleep Questions</h2>

    <h3>Should I nap when I arrive at my destination?</h3>
    <p>
      <strong>Avoid napping if possible</strong>, especially long naps. If you absolutely must nap,
      keep it to 20-30 minutes maximum in the early afternoon local time, and set an alarm. Long
      naps will make nighttime sleep more difficult.
    </p>

    <h3>Should I try to sleep on the plane?</h3>
    <p>
      <strong>Sleep when it's nighttime at your destination</strong>, stay awake when it's daytime
      there. This single principle is one of the most effective jet lag strategies.
    </p>

    <h3>What if I can't fall asleep on the plane?</h3>
    <p>
      Don't stress—<strong>rest is still beneficial</strong>. Close your eyes, practice relaxation
      techniques, and avoid screens. You'll still get some recovery even without full sleep. Plan
      for a shorter wake window after arrival if needed.
    </p>

    <h3>Is it better to sleep on my home schedule for short trips?</h3>
    <p>
      For trips <strong>shorter than 2-3 days</strong>, staying on home time can be a valid strategy.
      You avoid adjusting twice (there and back) and can use naps and caffeine to manage
      performance. Schedule important activities for times when you're naturally alert on home time.
    </p>

    <h3>Can I "bank" sleep before a trip?</h3>
    <p>
      You can't stockpile sleep, but <strong>starting well-rested is crucial</strong>. Avoid pulling
      all-nighters before travel. Being sleep-deprived before departure worsens jet lag symptoms
      significantly.
    </p>

    <h2>Melatonin Questions</h2>

    <h3>Does melatonin really help with jet lag?</h3>
    <p>
      Yes, <strong>melatonin can be effective</strong> for jet lag, especially for eastward travel.
      Multiple studies support its use. However, timing is critical—taking it at the wrong time can
      worsen jet lag.
    </p>

    <h3>When should I take melatonin?</h3>
    <p>
      For <strong>eastward travel</strong>, take melatonin in the early evening (6-8 PM) at your
      destination for the first 3-4 nights. For <strong>westward travel</strong>, melatonin is
      generally less helpful. Always consult with a healthcare provider about appropriate timing and
      dosage for your specific situation.
    </p>

    <h3>What dose of melatonin should I take?</h3>
    <p>
      <strong>0.5-3mg is typically sufficient</strong>. More is not necessarily better—high doses
      (10mg+) don't improve effectiveness and may cause more side effects. Start with a lower dose
      (0.5-1mg) and adjust if needed.
    </p>

    <h3>Is melatonin safe?</h3>
    <p>
      For most healthy adults, short-term melatonin use is safe. However,
      <strong>consult your doctor</strong>, especially if you're pregnant, nursing, have autoimmune
      conditions, take medications (blood thinners, diabetes meds), or plan to give it to children.
    </p>

    <h3>Why do I feel groggy after taking melatonin?</h3>
    <p>
      Some people experience residual drowsiness, especially with higher doses. Try
      <strong>lowering the dose</strong> or taking it earlier in the evening. Morning grogginess can
      also indicate you're taking it at the wrong time for your circadian rhythm.
    </p>

    <h2>Nutrition and Hydration Questions</h2>

    <h3>Does the "jet lag diet" (feast-fast) really work?</h3>
    <p>
      The Argonne Anti-Jet Lag Diet has mixed evidence. Modern research suggests
      <strong>meal timing is more important than feast/fast cycling</strong>. Simply eating meals
      according to destination schedule is effective without the complicated feast-fast protocol.
    </p>

    <h3>Should I avoid alcohol completely when traveling?</h3>
    <p>
      Alcohol <strong>disrupts sleep quality and causes dehydration</strong>, both of which worsen
      jet lag. It's best to avoid or minimize it, especially on the flight. If you do drink, limit
      it to one drink early in the flight and compensate with extra water.
    </p>

    <h3>How much water should I drink on a plane?</h3>
    <p>
      Aim for about <strong>8 ounces (240ml) per hour of flight</strong>. Cabin humidity is very low
      (10-20%), leading to dehydration. Bring an empty water bottle through security and fill it
      frequently.
    </p>

    <h3>Does caffeine help or hurt jet lag?</h3>
    <p>
      Caffeine can be helpful if used <strong>strategically</strong>. Use it to promote alertness
      when you need to stay awake, but cut off 6-8 hours before bedtime. Excessive or poorly timed
      caffeine can interfere with sleep and delay adjustment.
    </p>

    <h2>Exercise Questions</h2>

    <h3>When should I exercise when dealing with jet lag?</h3>
    <p>
      <strong>Morning exercise</strong> helps advance your rhythm (eastward travel).
      <strong>Evening exercise</strong> helps delay your rhythm (westward travel). Even light
      activity like walking is beneficial. Avoid intense exercise within 3-4 hours of bedtime.
    </p>

    <h3>Should I exercise even if I'm exhausted from jet lag?</h3>
    <p>
      Yes, but <strong>start with light activity</strong>. Even a 15-minute walk can boost energy
      and alertness. Listen to your body—don't push for intense workouts if you're severely
      jet-lagged, but gentle movement almost always helps.
    </p>

    <h2>Special Situations</h2>

    <h3>How do I handle jet lag with kids?</h3>
    <p>
      Children's circadian rhythms are more flexible than adults'. Apply the same principles:
      <strong>gradual schedule shifts, appropriate light exposure, destination-time meals</strong>.
      Maintain consistent routines. Be patient—behavior and mood are affected before sleep
      normalizes.
    </p>

    <h3>I'm pregnant—what jet lag strategies are safe?</h3>
    <p>
      Most non-pharmaceutical strategies are safe: <strong>light exposure, sleep timing, meal timing,
      exercise</strong>. However, <strong>avoid melatonin</strong> during pregnancy. Stay very well
      hydrated, wear compression socks, and move frequently during flights. Consult your OB-GYN
      before traveling.
    </p>

    <h3>Does age affect jet lag?</h3>
    <p>
      Yes, <strong>older adults often experience more severe and prolonged jet lag</strong>.
      Circadian rhythm amplitude decreases with age, and sleep quality is often already compromised.
      Older travelers should allow more adjustment time and may benefit more from gradual pre-travel
      shifting.
    </p>

    <h3>I have a sleep disorder—what should I know?</h3>
    <p>
      <strong>Consult your sleep specialist before travel</strong>. Existing sleep disorders
      (insomnia, sleep apnea, restless leg syndrome) can worsen with jet lag. Bring necessary
      equipment (CPAP machine), maintain medications, and consider more gradual adjustment
      strategies.
    </p>

    <h3>What about crossing the International Date Line?</h3>
    <p>
      Crossing the date line is disorienting but follows the same circadian principles. Focus on the
      <strong>direction of shift needed</strong> (advance or delay) rather than the calendar change.
      Flights like Los Angeles to Tokyo require advancing your rhythm even though you "lose" a day.
    </p>

    <h3>Do business or first class really help with jet lag?</h3>
    <p>
      <strong>Better sleep on the plane absolutely helps</strong>. If you can sleep comfortably in
      premium cabins and arrive rested, it significantly reduces jet lag. However, the fundamental
      circadian adjustment still needs to occur—premium cabins make travel more comfortable but
      don't eliminate circadian misalignment.
    </p>

    <h2>Technology and Tools</h2>

    <h3>Are jet lag apps and calculators accurate?</h3>
    <p>
      <strong>Many are based on sound science</strong> (NASA algorithms, circadian research). They
      can provide helpful guidance on light exposure and sleep timing. However, individual variation
      means you may need to adjust recommendations based on your personal response.
    </p>

    <h3>Do light therapy lamps work?</h3>
    <p>
      Yes, <strong>10,000 lux light therapy lamps are effective</strong> for circadian shifting,
      especially useful before travel when you can't control outdoor light or during winter months.
      Use for 20-30 minutes at the appropriate time for your travel direction.
    </p>

    <h3>Are there gadgets or devices that help with jet lag?</h3>
    <p>
      Some devices show promise:
      <strong>wearable light therapy devices, sleep tracking wearables, smart sleep masks</strong>.
      However, basic strategies (outdoor light, consistent sleep timing) are often equally or more
      effective than expensive gadgets.
    </p>

    <h2>Work and Performance</h2>

    <h3>How do I perform well in meetings despite jet lag?</h3>
    <p>
      <strong>Arrive early if possible</strong> (1-2 days before important meetings). Schedule
      critical meetings for times when you're naturally alert on home time if you can't adjust
      fully. Use caffeine strategically. Stay hydrated. Practice your presentation so you can
      perform even when not at peak.
    </p>

    <h3>Should I tell my boss/colleagues I'm jet-lagged?</h3>
    <p>
      <strong>Be honest but professional</strong>. "I arrived yesterday and I'm still adjusting to
      the time zone" is a reasonable statement. Focus on what you're doing to manage it rather than
      using it as an excuse for poor performance.
    </p>

    <h2>Return Journey</h2>

    <h3>Will I get jet lag again when I return home?</h3>
    <p>
      Yes, <strong>you'll need to re-adjust</strong> to your home time zone. The same strategies
      apply in reverse. For short trips (under 3 days), staying on home time avoids double jet lag.
    </p>

    <h3>Is the return trip easier than the outbound trip?</h3>
    <p>
      Not necessarily. The <strong>direction matters more than familiarity</strong>. If your
      outbound trip was eastward (harder) and your return is westward (easier), then yes. But if
      both directions are challenging or you're already tired, the return can feel equally difficult.
    </p>

    <blockquote>
      <strong>Still have questions?</strong> These FAQs cover the most common concerns, but everyone's
      situation is unique. Consider creating a personalized travel plan to address your specific
      needs and circumstances.
    </blockquote>
  </EducationLayout>
</template>

<script setup lang="ts">
import EducationLayout from '~/components/education/EducationLayout.vue'
import type { RelatedTopic } from '~/types/relatedTopic'

const relatedTopics: RelatedTopic[] = [
  {
    path: '/learn/circadian-rhythms',
    icon: '🕐',
    title: 'Circadian Rhythms',
    description: 'Deep dive into how your body clock works',
  },
  {
    path: '/learn/scientific-references',
    icon: '📚',
    title: 'Scientific References',
    description: 'Explore the research behind these recommendations',
  },
]

useSeoMeta({
  title: 'Jet Lag FAQ - Common Questions Answered | Voyage Clock',
  description: 'Get answers to frequently asked questions about jet lag, circadian rhythms, and travel health. Learn about eastward vs westward travel, adjustment times, melatonin use, and evidence-based strategies.',
  ogTitle: 'Frequently Asked Questions About Jet Lag | Voyage Clock',
  ogDescription: 'Quick answers to common questions about jet lag severity, recovery time, prevention strategies, and circadian rhythm science.',
  ogImage: 'https://voyageclock.com/og/faq.png',
  ogUrl: 'https://voyageclock.com/learn/faq',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Jet Lag FAQ - Your Questions Answered',
  twitterDescription: 'Find answers to common jet lag questions about symptoms, recovery, prevention, and travel strategies.',
  twitterImage: 'https://voyageclock.com/og/faq.png',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://voyageclock.com/learn/faq' }
  ]
})
</script>
