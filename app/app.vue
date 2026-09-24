<script setup lang="ts">
const localeHead = useLocaleHead({
  seo: { canonicalQueries: [] },
})

useHead({
  bodyAttrs: {
    class: 'm-0 min-w-[320px] bg-paper font-sans text-ink [font-synthesis:none] [text-rendering:optimizeLegibility]',
  },
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs.lang,
  },
  link: () => [
    ...localeHead.value.link,
  ],
  meta: () => localeHead.value.meta,
})
</script>

<template>
  <div class="site-shell box-border min-h-screen [&_*]:box-border [&_a]:text-inherit [&_button]:font-[inherit] [&_input]:font-[inherit] [&_select]:font-[inherit]">
    <NuxtRouteAnnouncer />
    <SiteHeader />
    <main><NuxtPage /></main>
    <footer class="mx-auto mt-16 flex w-[min(1120px,calc(100%-3rem))] items-center justify-between border-t border-[#e4e9e1] py-6 pb-8 text-[.85rem] text-muted max-[560px]:w-[min(calc(100%-2rem),1120px)] max-[560px]:items-start max-[560px]:flex-col max-[560px]:gap-[.7rem]">
      <NuxtLinkLocale class="inline-flex items-center gap-[.55rem] font-display text-[1.1rem] font-extrabold tracking-[-.04em] text-ink no-underline hover:text-green" to="/"><span class="grid size-[1.8rem] place-items-center rounded-full bg-[#e7efe4] text-green text-[1.2rem]">◷</span> voyageclock</NuxtLinkLocale>
      <span>{{ $t('app.tagline') }}</span>
    </footer>
  </div>
</template>
