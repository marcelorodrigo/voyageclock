<script setup lang="ts">
useSeoMeta({
  title: 'The science of timezone adaptation — VoyageClock',
  description: 'Learn how circadian rhythms, light, sleep schedules, and caffeine relate to jet lag.',
})
</script>

<template>
  <article class="science-page">
    <header><p class="eyebrow">A LITTLE SCIENCE, A LOT OF CONTEXT</p><h1>Your body clock<br>runs on <em>light.</em></h1><p class="lede">Jet lag is the mismatch between your internal rhythms and local time after crossing time zones. Light is a powerful cue for the body clock—but timing is the important part.</p></header>
    <section><span class="section-icon">☀</span><div><h2>Light can shift your clock in either direction</h2><p>Light exposure at different points in the circadian cycle can move the clock earlier or later. The effect depends on biological timing, not just what the clock on the wall says. Without measuring your circadian phase, a generic “get morning light” instruction can be too simplistic—particularly after a large timezone change.</p><p>That’s why VoyageClock keeps light advice practical and qualified. For larger or ambiguous shifts, it explains the uncertainty instead of claiming to know the perfect exposure window.</p></div></section>
    <section><span class="section-icon moon">☾</span><div><h2>Protect sleep while making gradual changes</h2><p>Before travel, modest adjustments to bedtime and wake time may make the transition feel more manageable. Research has tested advancing schedules combined with timed bright light before eastward travel, but the studied protocol and participants are not identical to every traveler.</p><p>VoyageClock starts with small schedule steps and preserves your usual sleep opportunity. It does not make up for missed preparation days by asking you to abruptly shift or sleep less.</p></div></section>
    <section><span class="section-icon coffee">☕</span><div><h2>Caffeine can trade alertness for sleep</h2><p>Caffeine can help with alertness, but its effects can linger and interfere with sleep. A practical plan can suggest avoiding it in the hours before intended bedtime; individual sensitivity and caffeine metabolism vary.</p><p>VoyageClock’s eight-hour cutoff is a conservative sleep-planning rule based on general sleep guidance, not a personalized measurement of how your body processes caffeine.</p></div></section>
    <aside class="limits"><h2>What this plan can—and can’t—tell you</h2><ul><li>It uses the times and timezone information you provide to create a simple schedule.</li><li>It does not measure your circadian phase, predict exactly when jet lag symptoms will end, or guarantee a particular result.</li><li>It is general wellness information for adults, not a diagnosis or medical treatment.</li><li>For medical conditions, medication questions, pregnancy, or persistent sleep problems, consult a qualified health professional.</li></ul></aside>
    <section class="sources"><span class="section-icon">↗</span><div><h2>Sources to explore</h2><ul><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2082105/" target="_blank" rel="noreferrer">Sack et al. (2007), AASM review: circadian rhythm sleep disorders and jet lag</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1262683/" target="_blank" rel="noreferrer">Burgess et al. (2003), preflight adjustment to eastward travel</a></li><li><a href="https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits" target="_blank" rel="noreferrer">National Heart, Lung, and Blood Institute: healthy sleep habits</a></li><li><a href="https://www.nhs.uk/conditions/jet-lag/" target="_blank" rel="noreferrer">NHS: jet lag guidance</a></li></ul></div></section>
    <NuxtLink class="button button-primary" to="/plan">Plan your next trip <span aria-hidden="true">→</span></NuxtLink>
  </article>
</template>

<style scoped>
.science-page { width: min(760px, calc(100% - 3rem)); margin: 0 auto; padding: 3rem 0 1rem; }
.science-page > header { margin-bottom: 2.5rem; }
.eyebrow { color: var(--green); font-size: .72rem; font-weight: 800; letter-spacing: .14em; }
h1, h2 { font-family: var(--display); letter-spacing: -.045em; }
h1 { margin: .7rem 0 1rem; font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1.05; }h1 em { color: var(--green); font-weight: 600; }
.lede { max-width: 650px; margin: 0; color: #596b60; font-size: 1.1rem; line-height: 1.7; }
.science-page > section { display: grid; grid-template-columns: 2.7rem 1fr; gap: 1rem; margin: 2rem 0; }
.section-icon { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: .8rem; background: #fbf2dc; color: #bd8d2b; font-size: 1.2rem; }
.section-icon.moon { background: #e9eefa; color: #5a72a8; }.section-icon.coffee { background: #f1e9df; color: #89694c; }
h2 { margin: .1rem 0 .7rem; font-size: 1.28rem; letter-spacing: -.03em; }.science-page section p { color: #56665d; font-size: .98rem; line-height: 1.7; }.science-page section p:first-of-type { margin-top: 0; }
.limits { margin: 2.5rem 0; padding: 1.5rem; border: 1px solid #e0e7dc; border-radius: 1rem; background: #fff; }.limits h2 { margin-top: 0; }.limits ul, .sources ul { padding-left: 1.2rem; color: #56665d; line-height: 1.8; }.sources ul { margin-bottom: 0; }.sources li + li { margin-top: .45rem; }.sources a { color: var(--green-dark); text-underline-offset: 3px; }
@media (max-width: 560px) { .science-page { width: min(100% - 2rem, 760px); padding-top: 2rem; }.science-page > section { grid-template-columns: 2rem 1fr; gap: .7rem; }.section-icon { width: 2rem; height: 2rem; font-size: 1rem; } }
</style>
