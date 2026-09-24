<script setup lang="ts">
useSeoMeta({
  title: 'VoyageClock — arrive in rhythm',
  description: 'A personal, science-informed sleep, light, and caffeine plan for your next timezone crossing.',
})
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-copy">
        <span class="hero-label"><span class="sun-mark">✳</span> YOUR BODY HAS A CLOCK. LET’S HELP IT CATCH UP.</span>
        <h1>Arrive ready<br>for <em>what’s next.</em></h1>
        <p>Crossing time zones can throw off your rhythm. Get a thoughtful, personalized plan for sleep, light, and caffeine—before you even pack.</p>
        <div class="hero-actions"><NuxtLink class="button button-primary" to="/plan">Start planning <span aria-hidden="true">→</span></NuxtLink><NuxtLink class="science-link" to="/science">Explore the science <span aria-hidden="true">↗</span></NuxtLink></div>
        <div class="hero-proof"><span class="proof-dot">✓</span> Rooted in circadian rhythm research <span class="proof-separator">·</span> Built around your trip</div>
      </div>
      <div class="clock-art" aria-label="Illustration of a clock over a horizon">
        <div class="orbit orbit-one" /><div class="orbit orbit-two" />
        <div class="sun-disc"><span class="sun-face">☼</span></div>
        <div class="clock-face"><span class="clock-center" /><span class="clock-hand hour-hand" /><span class="clock-hand minute-hand" /><span class="clock-tick tick-one" /><span class="clock-tick tick-two" /><span class="clock-tick tick-three" /><span class="clock-tick tick-four" /></div>
        <span class="art-star star-one">✳</span><span class="art-star star-two">✦</span><span class="art-label label-top">HOME TIME</span><span class="art-label label-bottom">YOUR NEXT CHAPTER</span>
      </div>
    </section>

    <section class="benefits" aria-label="What your plan includes">
      <article><span class="benefit-icon light-icon">☀</span><div><h2>Light, well-timed</h2><p>Understand when everyday light may help—and when exact timing is uncertain.</p></div></article>
      <article><span class="benefit-icon sleep-icon">☾</span><div><h2>Sleep that shifts gently</h2><p>Small schedule steps that protect the sleep you need.</p></div></article>
      <article><span class="benefit-icon plan-icon">▤</span><div><h2>Your trip, in focus</h2><p>A simple day-by-day timeline from preparation through arrival.</p></div></article>
    </section>

    <section class="bottom-cta"><div><p class="eyebrow">A BETTER LANDING STARTS BEFORE TAKEOFF</p><h2>Make time for the trip.<br>Not the jet lag.</h2></div><NuxtLink class="button button-primary" to="/plan">Build your free plan <span aria-hidden="true">→</span></NuxtLink></section>
  </div>
</template>

<style scoped>
.home-page { overflow: hidden; }
.hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 2rem; width: min(1120px, calc(100% - 3rem)); min-height: 555px; margin: 0 auto; padding: 2.5rem 0 3.5rem; }
.hero-copy { position: relative; z-index: 1; }
.hero-label, .eyebrow { color: var(--green); font-size: .72rem; font-weight: 800; letter-spacing: .14em; }
.sun-mark { margin-right: .45rem; font-size: 1rem; }
h1, h2 { font-family: var(--display); letter-spacing: -.055em; }
h1 { margin: 1.2rem 0 1rem; font-size: clamp(3.3rem, 7vw, 5.6rem); line-height: 1.02; }
h1 em { color: var(--green); font-weight: 600; }
.hero-copy > p { max-width: 470px; margin: 0; color: #596b60; font-size: 1.07rem; line-height: 1.7; }
.hero-actions { display: flex; align-items: center; gap: 1.35rem; margin-top: 1.8rem; }
.science-link { color: var(--ink); font-weight: 700; text-decoration: none; }
.science-link:hover { color: var(--green); }
.hero-proof { display: flex; align-items: center; gap: .5rem; margin-top: 2rem; color: var(--muted); font-size: .82rem; }
.proof-dot { display: grid; place-items: center; width: 1.15rem; height: 1.15rem; border-radius: 50%; background: #e5efe3; color: var(--green); font-size: .7rem; font-weight: 900; }
.proof-separator { color: #b8c2b9; }
.clock-art { position: relative; display: grid; place-items: center; min-height: 440px; isolation: isolate; }
.clock-art::before { position: absolute; z-index: -2; width: min(35vw, 390px); aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 50% 50%, #e7efdf 0 48%, transparent 49%); content: ''; }
.orbit { position: absolute; width: min(41vw, 450px); aspect-ratio: 1; border: 1px solid #dce6d6; border-radius: 50%; }
.orbit-two { width: min(47vw, 520px); border-style: dashed; opacity: .7; }
.sun-disc { position: absolute; top: 49px; right: 18%; display: grid; place-items: center; width: 104px; height: 104px; border-radius: 50%; background: #e8bd67; box-shadow: 0 0 0 14px #e8bd671c; }
.sun-face { color: #fff8df; font-size: 3.5rem; }
.clock-face { position: relative; display: grid; place-items: center; width: min(21vw, 235px); aspect-ratio: 1; border: 1px solid #91ae90; border-radius: 50%; background: #f7f8f3e8; box-shadow: 0 14px 35px #40594012; }
.clock-center { z-index: 2; width: 11px; height: 11px; border-radius: 50%; background: var(--green); }
.clock-hand { position: absolute; bottom: 50%; left: calc(50% - 2px); width: 4px; border-radius: 9px; background: var(--green); transform-origin: bottom; }
.hour-hand { height: 65px; transform: rotate(38deg); }
.minute-hand { height: 84px; width: 2px; background: #a7b899; transform: rotate(138deg); }
.clock-tick { position: absolute; width: 4px; height: 12px; border-radius: 5px; background: #9eb398; }
.tick-one { top: 13px; }.tick-two { right: 13px; transform: rotate(90deg); }.tick-three { bottom: 13px; }.tick-four { left: 13px; transform: rotate(90deg); }
.art-star { position: absolute; color: var(--green); }.star-one { top: 85px; left: 19%; font-size: 1.4rem; }.star-two { right: 13%; bottom: 100px; color: #d0a64e; font-size: 1.3rem; }
.art-label { position: absolute; color: #819387; font-size: .65rem; font-weight: 800; letter-spacing: .17em; }.label-top { top: 75px; left: 34%; }.label-bottom { bottom: 62px; right: 18%; }
.benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; width: min(1120px, calc(100% - 3rem)); margin: 0 auto; padding: 2rem 0 2.5rem; border-top: 1px solid #e4e9e1; }
.benefits article { display: flex; align-items: flex-start; gap: .9rem; }
.benefit-icon { display: grid; flex: none; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: .8rem; font-size: 1.2rem; }
.light-icon { background: #fbf2dc; color: #bd8d2b; }.sleep-icon { background: #e9eefa; color: #5a72a8; }.plan-icon { background: #e5efe3; color: var(--green); }
.benefits h2 { margin: .1rem 0 .35rem; font-size: 1rem; letter-spacing: -.02em; }.benefits p { margin: 0; color: var(--muted); font-size: .87rem; line-height: 1.55; }
.bottom-cta { display: flex; align-items: center; justify-content: space-between; gap: 2rem; width: min(1120px, calc(100% - 3rem)); margin: 1rem auto 0; padding: 2rem 0 3.4rem; border-top: 1px solid #e4e9e1; }
.bottom-cta h2 { margin: .55rem 0 0; font-size: 2rem; line-height: 1.2; }
@media (max-width: 760px) { .hero { grid-template-columns: 1fr; padding-top: 3rem; }.clock-art { min-height: 360px; }.clock-face { width: 210px; }.orbit { width: 340px; }.orbit-two { width: 390px; }.benefits { grid-template-columns: 1fr; gap: 1.3rem; } }
@media (max-width: 560px) { .hero, .benefits, .bottom-cta { width: min(100% - 2rem, 1120px); }.hero { gap: 0; }.hero-label { font-size: .62rem; }.hero-proof { align-items: flex-start; flex-wrap: wrap; }.bottom-cta { align-items: flex-start; flex-direction: column; } }
</style>
