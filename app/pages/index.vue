<script setup lang="ts">
useSeoMeta({
  title: 'VoyageClock — arrive in rhythm',
  description: 'A personal, science-informed sleep, light, and caffeine plan for your next timezone crossing.',
})
</script>

<template>
  <div class="overflow-hidden">
    <section class="mx-auto grid min-h-[555px] w-[min(1120px,calc(100%_-_3rem))] grid-cols-2 items-center gap-8 py-10 pb-14 max-[760px]:grid-cols-1 max-[760px]:pt-12 max-[560px]:w-[min(calc(100%_-_2rem),1120px)] max-[560px]:gap-0">
      <div class="relative z-[1]">
        <span class="text-[.72rem] font-extrabold tracking-[.14em] text-green max-[560px]:text-[.62rem]"><span class="mr-[.45rem] text-base">✳</span> YOUR BODY HAS A CLOCK. LET’S HELP IT CATCH UP.</span>
        <h1 class="mt-[1.2rem] mb-4 font-display text-[clamp(3.3rem,7vw,5.6rem)] leading-[1.02] tracking-[-.055em]">Arrive ready<br>for <em class="font-semibold text-green">what’s next.</em></h1>
        <p class="m-0 max-w-[470px] text-[1.07rem] leading-[1.7] text-[#596b60]">Crossing time zones can throw off your rhythm. Get a thoughtful, personalized plan for sleep, light, and caffeine—before you even pack.</p>
        <div class="mt-[1.8rem] flex items-center gap-[1.35rem]"><NuxtLink class="inline-flex min-h-[3.2rem] cursor-pointer items-center justify-center gap-3 rounded-xl border-0 bg-green px-5 py-[.8rem] font-bold text-white no-underline hover:bg-green-dark" to="/plan">Start planning <span aria-hidden="true">→</span></NuxtLink><NuxtLink class="font-bold text-ink no-underline hover:text-green" to="/science">Explore the science <span aria-hidden="true">↗</span></NuxtLink></div>
        <div class="mt-8 flex items-center gap-2 text-[.82rem] text-muted max-[560px]:flex-wrap max-[560px]:items-start"><span class="grid size-[1.15rem] place-items-center rounded-full bg-[#e5efe3] text-[.7rem] font-black text-green">✓</span> Rooted in circadian rhythm research <span class="text-[#b8c2b9]">·</span> Built around your trip</div>
      </div>
      <HomeHeroIllustration />
    </section>

    <section class="mx-auto grid w-[min(1120px,calc(100%_-_3rem))] grid-cols-3 gap-8 border-t border-[#e4e9e1] py-8 pb-10 max-[760px]:grid-cols-1 max-[760px]:gap-[1.3rem] max-[560px]:w-[min(calc(100%_-_2rem),1120px)]" aria-label="What your plan includes">
      <HomeFeatureItem icon="☀" title="Light, well-timed" description="Understand when everyday light may help—and when exact timing is uncertain." tone="gold" />
      <HomeFeatureItem icon="☾" title="Sleep that shifts gently" description="Small schedule steps that protect the sleep you need." tone="blue" />
      <HomeFeatureItem icon="▤" title="Your trip, in focus" description="A simple day-by-day timeline from preparation through arrival." tone="green" />
    </section>

    <section class="mx-auto mt-4 flex w-[min(1120px,calc(100%_-_3rem))] items-center justify-between gap-8 border-t border-[#e4e9e1] py-8 pb-[3.4rem] max-[560px]:w-[min(calc(100%_-_2rem),1120px)] max-[560px]:items-start max-[560px]:flex-col"><div><p class="text-[.72rem] font-extrabold tracking-[.14em] text-green">A BETTER LANDING STARTS BEFORE TAKEOFF</p><h2 class="mt-[.55rem] mb-0 font-display text-[2rem] leading-[1.2] tracking-[-.055em]">Make time for the trip.<br>Not the jet lag.</h2></div><NuxtLink class="inline-flex min-h-[3.2rem] cursor-pointer items-center justify-center gap-3 rounded-xl border-0 bg-green px-5 py-[.8rem] font-bold text-white no-underline hover:bg-green-dark" to="/plan">Build your free plan <span aria-hidden="true">→</span></NuxtLink></section>
  </div>
</template>
