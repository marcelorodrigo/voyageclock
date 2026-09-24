<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  tone: 'gold' | 'blue' | 'green'
}>()

const toneClasses = {
  gold: 'bg-[#fbf2dc] text-[#bd8d2b]',
  blue: 'bg-[#e9eefa] text-[#5a72a8]',
  green: 'bg-[#e5efe3] text-green',
} as const
</script>

<template>
  <article class="flex items-start gap-[.9rem]">
    <span :class="['grid size-10 flex-none place-items-center rounded-[.8rem] text-[1.2rem]', toneClasses[tone]]">{{ icon }}</span>
    <div>
      <h2 class="my-[.1rem] mb-[.35rem] font-display text-base tracking-[-.02em]">{{ title }}</h2>
      <p class="m-0 text-[.87rem] leading-[1.55] text-muted">{{ description }}</p>
    </div>
  </article>
</template>
