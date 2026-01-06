<template>
  <div class="sleep-summary">
    <div class="sleep-summary-content">
      <span class="sleep-icon">😴</span>
      <div>
        <p class="sleep-summary-label">
          Sleep Duration
        </p>
        <p class="sleep-summary-value">
          {{ formattedDuration }}
        </p>
      </div>
    </div>
    <p
      v-if="warning"
      class="sleep-warning"
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

<style scoped>
.sleep-summary {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
}
.sleep-summary-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.sleep-icon {
  font-size: 1.875rem;
}
.sleep-summary-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}
.sleep-summary-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d4ed8;
}
.sleep-warning {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}
</style>
