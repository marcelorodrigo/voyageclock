<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('science.title'),
  description: () => t('science.description'),
})
</script>

<template>
  <article class="mx-auto w-[min(760px,calc(100%_-_3rem))] py-12 pb-4 max-[560px]:w-[min(calc(100%_-_2rem),760px)] max-[560px]:pt-8">
    <header class="mb-10"><p class="text-[.72rem] font-extrabold tracking-[.14em] text-green">{{ $t('science.eyebrow') }}</p><h1 class="my-[.7rem] mb-4 whitespace-pre-line font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-[-.045em]">{{ $t('science.headline') }} <em class="font-semibold text-green">{{ $t('science.headlineEmphasis') }}</em></h1><p class="m-0 max-w-[650px] text-[1.1rem] leading-[1.7] text-[#596b60]">{{ $t('science.intro') }}</p></header>
    <ScienceSection icon="☀" :title="$t('science.lightTitle')" tone="gold">
      <p class="text-[.98rem] leading-[1.7] text-[#56665d] first:mt-0">{{ $t('science.lightOne') }}</p>
      <p class="text-[.98rem] leading-[1.7] text-[#56665d]">{{ $t('science.lightTwo') }}</p>
    </ScienceSection>
    <ScienceSection icon="☾" :title="$t('science.sleepTitle')" tone="blue">
      <p class="text-[.98rem] leading-[1.7] text-[#56665d] first:mt-0">{{ $t('science.sleepOne') }}</p>
      <p class="text-[.98rem] leading-[1.7] text-[#56665d]">{{ $t('science.sleepTwo') }}</p>
    </ScienceSection>
    <ScienceSection icon="☕" :title="$t('science.caffeineTitle')" tone="brown">
      <p class="text-[.98rem] leading-[1.7] text-[#56665d] first:mt-0">{{ $t('science.caffeineOne') }}</p>
      <p class="text-[.98rem] leading-[1.7] text-[#56665d]">{{ $t('science.caffeineTwo') }}</p>
    </ScienceSection>
    <aside class="my-10 rounded-2xl border border-[#e0e7dc] bg-white p-6"><h2 class="mt-0 mb-[.7rem] font-display text-[1.28rem] tracking-[-.03em]">{{ $t('science.limitationsTitle') }}</h2><ul class="pl-5 leading-[1.8] text-[#56665d]"><li>{{ $t('science.limitationOne') }}</li><li>{{ $t('science.limitationTwo') }}</li><li>{{ $t('science.limitationThree') }}</li><li>{{ $t('science.limitationFour') }}</li></ul></aside>
    <ScienceSection icon="↗" :title="$t('science.sourcesTitle')" tone="gold">
      <ul class="mb-0 pl-5 leading-[1.8] text-[#56665d]"><li class="[&+li]:mt-[.45rem]"><a class="text-green-dark underline-offset-[3px]" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2082105/" target="_blank" rel="noreferrer">{{ $t('science.sourceAasm') }}</a></li><li class="[&+li]:mt-[.45rem]"><a class="text-green-dark underline-offset-[3px]" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1262683/" target="_blank" rel="noreferrer">{{ $t('science.sourceBurgess') }}</a></li><li class="[&+li]:mt-[.45rem]"><a class="text-green-dark underline-offset-[3px]" href="https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits" target="_blank" rel="noreferrer">{{ $t('science.sourceNhlbi') }}</a></li><li class="[&+li]:mt-[.45rem]"><a class="text-green-dark underline-offset-[3px]" href="https://www.nhs.uk/conditions/jet-lag/" target="_blank" rel="noreferrer">{{ $t('science.sourceNhs') }}</a></li></ul>
    </ScienceSection>
    <NuxtLinkLocale class="inline-flex min-h-[3.2rem] cursor-pointer items-center justify-center gap-3 rounded-xl border-0 bg-green px-5 py-[.8rem] font-bold text-white no-underline hover:bg-green-dark" to="/plan">{{ $t('science.planCta') }} <span aria-hidden="true">→</span></NuxtLinkLocale>
  </article>
</template>
