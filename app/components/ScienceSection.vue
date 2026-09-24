<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  tone: 'gold' | 'blue' | 'brown'
}>()

const toneClasses = {
  gold: 'bg-[#fbf2dc] text-[#bd8d2b]',
  blue: 'bg-[#e9eefa] text-[#5a72a8]',
  brown: 'bg-[#f1e9df] text-[#89694c]',
} as const
</script>

<template>
  <section class="my-8 grid grid-cols-[2.7rem_1fr] gap-4 max-[560px]:grid-cols-[2rem_1fr] max-[560px]:gap-[.7rem]">
    <span :class="['grid size-10 place-items-center rounded-[.8rem] text-[1.2rem] max-[560px]:size-8 max-[560px]:text-base', toneClasses[tone]]">{{ icon }}</span>
    <div>
      <h2 class="my-[.1rem] mb-[.7rem] font-display text-[1.28rem] tracking-[-.03em]">{{ title }}</h2>
      <slot />
    </div>
  </section>
</template>
