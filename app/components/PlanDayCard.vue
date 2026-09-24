<script setup lang="ts">
import type { MessageDescriptor, PlanDay } from '~/types/travel'

defineProps<{ day: PlanDay }>()
const { d, t } = useI18n()

function message(descriptor: MessageDescriptor): string {
  const params = Object.fromEntries(Object.entries(descriptor.params ?? {}).map(([key, value]) => [
    key,
    value && typeof value === 'object' && 'key' in value
      ? message(value as MessageDescriptor)
      : value,
  ]))
  return t(descriptor.key, params)
}

function readableDate(date: string): string {
  const formatted = d(new Date(`${date}T12:00:00Z`), 'planDay')
  return formatted
}

function zoneLabel(timeZone: string): string {
  return timeZone.replaceAll('_', ' ')
}
</script>

<template>
  <li class="relative pl-[1.6rem] before:absolute before:bottom-[-1.2rem] before:left-[.35rem] before:top-4 before:w-px before:bg-[#d8dfd5] before:content-[''] last:before:hidden">
    <span class="absolute left-0 top-[.65rem] z-[1] size-3 rounded-full border-2 border-green bg-white" aria-hidden="true" />
    <article class="rounded-[.9rem] border border-[#e1e6dc] bg-white p-[1.2rem]">
      <div class="flex flex-col justify-between gap-2 font-[750] text-ink sm:flex-row"><span>{{ message(day.label) }}</span><time class="text-[.85rem] font-normal text-muted" :datetime="day.date">{{ readableDate(day.date) }}</time></div>
      <p class="my-[.35rem] mb-4 text-[.85rem] text-muted">{{ zoneLabel(day.timeZone) }} {{ $t('timeline.localTime') }}</p>
      <div class="grid gap-[.7rem]">
        <div class="grid grid-cols-[1.5rem_1fr] items-start gap-2"><span class="text-[1.1rem] text-green" aria-hidden="true">☾</span><p class="m-0 leading-[1.5]">{{ message(day.guidance.sleep) }} {{ message(day.guidance.wake) }}</p></div>
        <div class="grid grid-cols-[1.5rem_1fr] items-start gap-2"><span class="text-[1.1rem] text-green" aria-hidden="true">☀</span><p class="m-0 leading-[1.5]">{{ message(day.guidance.light) }}</p></div>
        <div v-if="day.guidance.caffeine" class="grid grid-cols-[1.5rem_1fr] items-start gap-2"><span class="text-[1.1rem] text-green" aria-hidden="true">☕</span><p class="m-0 leading-[1.5]">{{ message(day.guidance.caffeine) }}</p></div>
      </div>
      <p class="mt-[.9rem] mb-0 border-t border-[#edf0ea] pt-[.8rem] text-[.85rem] leading-[1.5] text-muted">{{ message(day.guidance.explanation) }}</p>
    </article>
  </li>
</template>
