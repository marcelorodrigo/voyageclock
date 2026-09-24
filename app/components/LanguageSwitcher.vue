<script setup lang="ts">
import { preferredLocaleStorageKey } from '~/utils/languagePreference'

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

function changeLocale(targetLocale: string) {
  try {
    window.localStorage.setItem(preferredLocaleStorageKey, targetLocale)
  }
  catch {
    // The language switch still works when browser storage is unavailable.
  }

  return navigateTo(switchLocalePath(targetLocale))
}
</script>

<template>
  <label class="flex items-center gap-2 text-[.85rem] font-[650] text-ink">
    <span>{{ $t('app.language') }}</span>
    <select
      class="min-h-10 rounded-lg border border-[#cbd9c9] bg-white px-2 py-1 font-[inherit]"
      :value="locale"
      :aria-label="$t('app.language')"
      @change="changeLocale(($event.target as HTMLSelectElement).value)"
    >
      <option v-for="item in locales" :key="item.code" :value="item.code">{{ item.name }}</option>
    </select>
  </label>
</template>
