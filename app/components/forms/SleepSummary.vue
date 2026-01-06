<template>
  <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div class="flex items-center gap-3">
      <span class="text-[1.875rem]">😴</span>
      <div>
        <p class="text-sm font-medium text-gray-700">
          Sleep Duration
        </p>
        <p class="text-lg font-semibold text-blue-700">
          {{ formattedDuration }}
        </p>
      </div>
    </div>
    <p
      v-if="warning"
      class="mt-2 text-sm text-gray-700"
    >
      {{ warning }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ duration: number, warning?: string }>()

function formatDuration(hours: number): string {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours - wholeHours) * 60)
  if (minutes === 0) return `${wholeHours} hour${wholeHours === 1 ? '' : 's'}`
  return `${wholeHours} hour${wholeHours === 1 ? '' : 's'} ${minutes} min`
}
const formattedDuration = formatDuration(props.duration)
</script>
