<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('planPage.title'),
  description: () => t('planPage.description'),
})

const plan = usePlannerState()

function showPlan(result: NonNullable<typeof plan.value>): void {
  plan.value = result
  void navigateTo(localePath('/plan/result'))
}
</script>

<template>
  <div class="mx-auto w-[min(850px,calc(100%_-_3rem))] py-12 pb-4 max-[560px]:w-[min(calc(100%_-_2rem),850px)] max-[560px]:pt-8">
    <section class="mx-auto mb-8 max-w-[660px] text-center"><p class="text-[.72rem] font-extrabold tracking-[.14em] text-green">{{ $t('planPage.eyebrow') }}</p><h1 class="my-[.55rem] mb-[.7rem] font-display text-[clamp(2rem,5vw,3rem)] tracking-[-.045em]">{{ $t('planPage.heading') }}</h1><p class="m-0 text-[1.03rem] leading-[1.6] text-muted">{{ $t('planPage.intro') }}</p></section>
    <section class="rounded-[1.1rem] border border-[#e1e6dc] bg-white p-[clamp(1.2rem,4vw,2rem)] shadow-[0_14px_40px_#344a3610]" aria-labelledby="trip-details-heading">
      <div class="mb-[1.6rem] flex items-start gap-[.9rem]"><span class="grid size-8 flex-none place-items-center rounded-[.65rem] bg-[#e8f0e5] text-[.8rem] font-extrabold text-green">01</span><div><h2 id="trip-details-heading" class="m-0 font-display text-[1.3rem] tracking-[-.03em] max-[560px]:text-[1.1rem]">{{ $t('planPage.detailsHeading') }}</h2><p class="mt-[.4rem] mb-0 text-[.88rem] leading-[1.5] text-muted">{{ $t('planPage.localTimes') }}</p></div></div>
      <TripPlannerForm @planned="showPlan" />
    </section>
    <aside class="mt-8 grid grid-cols-[1.5rem_1fr] gap-x-[.8rem] gap-y-[.4rem] rounded-[.9rem] bg-[#edf3e9] p-[1.2rem] text-[#41584a]"><span class="row-span-2 text-[1.3rem] text-[#b18a39]" aria-hidden="true">✳</span><p class="m-0 text-[.9rem] leading-[1.55]"><strong>{{ $t('planPage.lightTitle') }}</strong> {{ $t('planPage.lightDescription') }}</p><NuxtLinkLocale class="col-start-2 text-[.86rem] font-[750] text-green-dark no-underline" to="/science">{{ $t('planPage.scienceLink') }} →</NuxtLinkLocale></aside>
  </div>
</template>
