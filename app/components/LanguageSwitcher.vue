<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <label class="flex items-center gap-2 text-[.85rem] font-[650] text-ink">
    <span>{{ $t('app.language') }}</span>
    <select
      class="min-h-10 rounded-lg border border-[#cbd9c9] bg-white px-2 py-1 font-[inherit]"
      :value="locale"
      :aria-label="$t('app.language')"
      @change="navigateTo(switchLocalePath(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="item in locales" :key="item.code" :value="item.code">{{ item.name }}</option>
    </select>
  </label>
</template>
