<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const isMenuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)

watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false
    menuButton.value?.focus()
  }
}

let desktopQuery: MediaQueryList | undefined

function onBreakpointChange(event: MediaQueryListEvent) {
  if (event.matches) isMenuOpen.value = false
}

onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 64rem)')
  desktopQuery.addEventListener('change', onBreakpointChange)
})

onUnmounted(() => {
  desktopQuery?.removeEventListener('change', onBreakpointChange)
})
</script>

<template>
  <header class="mx-auto w-[min(1120px,calc(100%-2rem))] lg:w-[min(1120px,calc(100%-3rem))]" @keydown="onKeydown">
    <div class="flex min-h-[78px] items-center justify-between gap-4">
      <NuxtLinkLocale class="inline-flex shrink-0 items-center gap-[.55rem] font-display text-[1.1rem] font-extrabold tracking-[-.04em] no-underline" to="/" :aria-label="$t('app.home')" @click="isMenuOpen = false"><span class="grid size-[1.8rem] place-items-center rounded-full bg-[#e7efe4] text-green text-[1.2rem]">◷</span> voyageclock</NuxtLinkLocale>
      <button
        ref="menuButton"
        type="button"
        class="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#cbd9c9] text-ink hover:text-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green lg:hidden"
        :aria-label="$t(isMenuOpen ? 'app.closeMenu' : 'app.openMenu')"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span aria-hidden="true" class="text-xl leading-none">{{ isMenuOpen ? '×' : '☰' }}</span>
      </button>
      <nav class="hidden items-center gap-[1.2rem] lg:flex" :aria-label="$t('app.navigation')">
        <NuxtLinkLocale class="text-[.9rem] font-[650] no-underline hover:text-green" to="/science">{{ $t('app.science') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="rounded-full border border-[#cbd9c9] px-4 py-[.65rem] text-[.9rem] font-[650] no-underline hover:text-green" to="/plan">{{ $t('app.planTrip') }} <span aria-hidden="true">↗</span></NuxtLinkLocale>
        <LanguageSwitcher />
      </nav>
    </div>
    <nav
      v-show="isMenuOpen"
      id="mobile-navigation"
      class="border-t border-[#e4e9e1] pb-5 pt-3 lg:hidden"
      :aria-label="$t('app.navigation')"
    >
      <div class="flex flex-col gap-2">
        <NuxtLinkLocale class="flex min-h-11 items-center rounded-lg px-3 font-[650] no-underline hover:bg-[#e7efe4] hover:text-green" to="/science" @click="isMenuOpen = false">{{ $t('app.science') }}</NuxtLinkLocale>
        <NuxtLinkLocale class="flex min-h-11 items-center rounded-lg border border-[#cbd9c9] px-3 font-[650] no-underline hover:text-green" to="/plan" @click="isMenuOpen = false">{{ $t('app.planTrip') }} <span class="ml-2" aria-hidden="true">↗</span></NuxtLinkLocale>
        <div class="min-w-0 px-3 pt-2 [&_label]:flex-wrap [&_select]:max-w-full">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  </header>
</template>
