<script setup lang="ts">
const localeHead = useLocaleHead({
  seo: { canonicalQueries: [] },
})

useHead({
  bodyAttrs: {
    class: 'm-0 min-w-[320px] bg-paper font-sans text-ink [font-synthesis:none] [text-rendering:optimizeLegibility]',
  },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap' },
  ],
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs.lang,
  },
  link: () => localeHead.value.link,
  meta: () => localeHead.value.meta,
})
</script>

<template>
  <div class="site-shell box-border min-h-screen [&_*]:box-border [&_a]:text-inherit [&_button]:font-[inherit] [&_input]:font-[inherit] [&_select]:font-[inherit]">
    <NuxtRouteAnnouncer />
    <header class="mx-auto flex h-[78px] w-[min(1120px,calc(100%-3rem))] items-center justify-between max-[560px]:w-[min(calc(100%-2rem),1120px)]">
      <NuxtLinkLocale class="inline-flex items-center gap-[.55rem] font-display text-[1.1rem] font-extrabold tracking-[-.04em] no-underline" to="/" :aria-label="$t('app.home')"><span class="grid size-[1.8rem] place-items-center rounded-full bg-[#e7efe4] text-green text-[1.2rem]">◷</span> voyageclock</NuxtLinkLocale>
      <nav class="flex items-center gap-[1.2rem] max-[560px]:gap-[.6rem]" :aria-label="$t('app.navigation')">
        <NuxtLinkLocale class="text-[.9rem] font-[650] no-underline hover:text-green max-[560px]:text-[.82rem]" to="/science">{{ $t('app.science') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="rounded-full border border-[#cbd9c9] px-4 py-[.65rem] text-[.9rem] font-[650] no-underline hover:text-green max-[560px]:text-[.82rem]" to="/plan">{{ $t('app.planTrip') }} <span aria-hidden="true">↗</span></NuxtLinkLocale>
        <LanguageSwitcher />
      </nav>
    </header>
    <main><NuxtPage /></main>
    <footer class="mx-auto mt-16 flex w-[min(1120px,calc(100%-3rem))] items-center justify-between border-t border-[#e4e9e1] py-6 pb-8 text-[.85rem] text-muted max-[560px]:w-[min(calc(100%-2rem),1120px)] max-[560px]:items-start max-[560px]:flex-col max-[560px]:gap-[.7rem]">
      <NuxtLinkLocale class="inline-flex items-center gap-[.55rem] font-display text-[1.1rem] font-extrabold tracking-[-.04em] text-ink no-underline hover:text-green" to="/"><span class="grid size-[1.8rem] place-items-center rounded-full bg-[#e7efe4] text-green text-[1.2rem]">◷</span> voyageclock</NuxtLinkLocale>
      <span>{{ $t('app.tagline') }}</span>
    </footer>
  </div>
</template>
