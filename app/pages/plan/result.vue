<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const plan = usePlannerState()

definePageMeta({ sitemap: false })

useSeoMeta({
  title: () => t('resultPage.title'),
  description: () => t('resultPage.description'),
})

onMounted(() => {
  if (!plan.value) {
    void navigateTo(localePath('/plan'), { replace: true })
  }
})
</script>

<template>
  <div v-if="plan" class="mx-auto w-[min(850px,calc(100%_-_3rem))] py-12 pb-4 max-[560px]:w-[min(calc(100%_-_2rem),850px)] max-[560px]:pt-8">
    <section class="mx-auto mb-8 max-w-[660px] text-center">
      <p class="text-[.72rem] font-extrabold tracking-[.14em] text-green">{{ $t('resultPage.eyebrow') }}</p>
      <h1 class="my-[.55rem] mb-[.7rem] font-display text-[clamp(2rem,5vw,3rem)] tracking-[-.045em]">{{ $t('resultPage.heading') }}</h1>
      <p class="m-0 text-[1.03rem] leading-[1.6] text-muted">{{ $t('resultPage.intro') }}</p>
    </section>
    <NuxtLinkLocale class="inline-flex min-h-11 items-center rounded-full border border-[#cbd9c9] px-4 py-2 text-[.9rem] font-[650] text-green-dark no-underline hover:text-green" to="/plan">{{ $t('resultPage.planAnother') }} <span class="ml-2" aria-hidden="true">↗</span></NuxtLinkLocale>
    <PlanTimeline :plan="plan" />
  </div>
</template>
