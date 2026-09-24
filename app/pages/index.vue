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
      <div class="isolate relative grid min-h-[440px] place-items-center max-[760px]:min-h-[360px]" aria-label="Illustration of a clock over a horizon">
        <div class="absolute -z-[2] aspect-square w-[min(35vw,390px)] rounded-full bg-[radial-gradient(circle_at_50%_50%,#e7efdf_0_48%,transparent_49%)] before:content-['']" />
        <div class="absolute aspect-square w-[min(41vw,450px)] rounded-full border border-[#dce6d6] max-[760px]:w-[340px]" /><div class="absolute aspect-square w-[min(47vw,520px)] rounded-full border border-dashed border-[#dce6d6] opacity-70 max-[760px]:w-[390px]" />
        <div class="absolute right-[18%] top-[49px] grid size-[104px] place-items-center rounded-full bg-[#e8bd67] shadow-[0_0_0_14px_#e8bd671c]"><span class="text-[3.5rem] text-[#fff8df]">☼</span></div>
        <div class="relative grid aspect-square w-[min(21vw,235px)] place-items-center rounded-full border border-[#91ae90] bg-[#f7f8f3e8] shadow-[0_14px_35px_#40594012] max-[760px]:w-[210px]"><span class="z-[2] size-[11px] rounded-full bg-green" /><span class="absolute bottom-1/2 left-[calc(50%-2px)] h-[65px] w-1 origin-bottom rotate-[38deg] rounded-[9px] bg-green" /><span class="absolute bottom-1/2 left-[calc(50%-2px)] h-[84px] w-[2px] origin-bottom rotate-[138deg] rounded-[9px] bg-[#a7b899]" /><span class="absolute top-[13px] h-3 w-1 rounded-[5px] bg-[#9eb398]" /><span class="absolute right-[13px] h-3 w-1 rotate-90 rounded-[5px] bg-[#9eb398]" /><span class="absolute bottom-[13px] h-3 w-1 rounded-[5px] bg-[#9eb398]" /><span class="absolute left-[13px] h-3 w-1 rotate-90 rounded-[5px] bg-[#9eb398]" /></div>
        <span class="absolute left-[19%] top-[85px] text-[1.4rem] text-green">✳</span><span class="absolute bottom-[100px] right-[13%] text-[1.3rem] text-[#d0a64e]">✦</span><span class="absolute left-[34%] top-[75px] text-[.65rem] font-extrabold tracking-[.17em] text-[#819387]">HOME TIME</span><span class="absolute bottom-[62px] right-[18%] text-[.65rem] font-extrabold tracking-[.17em] text-[#819387]">YOUR NEXT CHAPTER</span>
      </div>
    </section>

    <section class="mx-auto grid w-[min(1120px,calc(100%_-_3rem))] grid-cols-3 gap-8 border-t border-[#e4e9e1] py-8 pb-10 max-[760px]:grid-cols-1 max-[760px]:gap-[1.3rem] max-[560px]:w-[min(calc(100%_-_2rem),1120px)]" aria-label="What your plan includes">
      <article class="flex items-start gap-[.9rem]"><span class="grid size-10 flex-none place-items-center rounded-[.8rem] bg-[#fbf2dc] text-[1.2rem] text-[#bd8d2b]">☀</span><div><h2 class="my-[.1rem] mb-[.35rem] font-display text-base tracking-[-.02em]">Light, well-timed</h2><p class="m-0 text-[.87rem] leading-[1.55] text-muted">Understand when everyday light may help—and when exact timing is uncertain.</p></div></article>
      <article class="flex items-start gap-[.9rem]"><span class="grid size-10 flex-none place-items-center rounded-[.8rem] bg-[#e9eefa] text-[1.2rem] text-[#5a72a8]">☾</span><div><h2 class="my-[.1rem] mb-[.35rem] font-display text-base tracking-[-.02em]">Sleep that shifts gently</h2><p class="m-0 text-[.87rem] leading-[1.55] text-muted">Small schedule steps that protect the sleep you need.</p></div></article>
      <article class="flex items-start gap-[.9rem]"><span class="grid size-10 flex-none place-items-center rounded-[.8rem] bg-[#e5efe3] text-[1.2rem] text-green">▤</span><div><h2 class="my-[.1rem] mb-[.35rem] font-display text-base tracking-[-.02em]">Your trip, in focus</h2><p class="m-0 text-[.87rem] leading-[1.55] text-muted">A simple day-by-day timeline from preparation through arrival.</p></div></article>
    </section>

    <section class="mx-auto mt-4 flex w-[min(1120px,calc(100%_-_3rem))] items-center justify-between gap-8 border-t border-[#e4e9e1] py-8 pb-[3.4rem] max-[560px]:w-[min(calc(100%_-_2rem),1120px)] max-[560px]:items-start max-[560px]:flex-col"><div><p class="text-[.72rem] font-extrabold tracking-[.14em] text-green">A BETTER LANDING STARTS BEFORE TAKEOFF</p><h2 class="mt-[.55rem] mb-0 font-display text-[2rem] leading-[1.2] tracking-[-.055em]">Make time for the trip.<br>Not the jet lag.</h2></div><NuxtLink class="inline-flex min-h-[3.2rem] cursor-pointer items-center justify-center gap-3 rounded-xl border-0 bg-green px-5 py-[.8rem] font-bold text-white no-underline hover:bg-green-dark" to="/plan">Build your free plan <span aria-hidden="true">→</span></NuxtLink></section>
  </div>
</template>
