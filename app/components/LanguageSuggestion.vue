<script setup lang="ts">
defineProps<{
  language: string
}>()

defineEmits<{
  accept: []
  dismiss: []
}>()
</script>

<template>
  <aside class="mx-auto mt-4 flex w-[min(1120px,calc(100%-2rem))] flex-wrap items-center justify-between gap-3 rounded-xl border border-[#cbd9c9] bg-white px-4 py-3 text-[.9rem] text-ink lg:w-[min(1120px,calc(100%-3rem))]" aria-labelledby="language-suggestion-message">
    <p id="language-suggestion-message" class="m-0">{{ $t('app.languageSuggestion', { language }) }}</p>
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="min-h-10 rounded-lg bg-green px-4 py-2 font-[650] text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        @click="$emit('accept')"
      >
        {{ $t('app.switchToLanguage', { language }) }}
      </button>
      <button
        type="button"
        class="min-h-10 rounded-lg px-3 py-2 font-[650] text-ink underline decoration-[#cbd9c9] underline-offset-4 hover:text-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        @click="$emit('dismiss')"
      >
        {{ $t('app.dismissLanguageSuggestion') }}
      </button>
    </div>
  </aside>
</template>
