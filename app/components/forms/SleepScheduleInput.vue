<template>
  <div class="sleep-schedule-input">
    <h3 class="section-title">
      Your Current Sleep Schedule
    </h3>
    <p class="section-description">
      This helps us create personalized recommendations for adapting to your destination timezone.
    </p>
    <div class="sleep-inputs">
      <SleepTimeInput
        :id="`${id}-bedtime`"
        :model-value="bedtime"
        label="Usual Bedtime"
        :error="bedtimeError"
        :required="true"
        @update:model-value="onBedtimeChange"
        @blur="() => emit('blur', 'bedtime')"
      />
      <SleepTimeInput
        :id="`${id}-waketime`"
        :model-value="wakeTime"
        label="Usual Wake Time"
        :error="wakeTimeError"
        :required="true"
        @update:model-value="onWakeTimeChange"
        @blur="() => emit('blur', 'wakeTime')"
      />
    </div>
    <SleepSummary
      v-if="typeof sleepDuration === 'number' && !isNaN(sleepDuration)"
      :duration="sleepDuration"
      :warning="sleepWarning"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { calculateSleepDuration } from '~/utils/dateTimeUtils'
import SleepTimeInput from './SleepTimeInput.vue'
import SleepSummary from './SleepSummary.vue'

interface Props {
  id: string
  bedtime: string
  wakeTime: string
  bedtimeError?: string
  wakeTimeError?: string
}

interface Emits {
  (e: 'update:bedtime' | 'update:wakeTime', value: string): void
  (e: 'blur', field: 'bedtime' | 'wakeTime'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const sleepDuration = computed(() => {
  if (!props.bedtime || !props.wakeTime) return null
  return calculateSleepDuration(props.bedtime, props.wakeTime)
})

const sleepWarning = computed(() => {
  if (!sleepDuration.value) return null
  if (sleepDuration.value < 4) {
    return '⚠️ This seems very short. Most adults need 7-9 hours of sleep.'
  }
  if (sleepDuration.value < 6) {
    return 'This is shorter than recommended. Consider if this is typical for you.'
  }
  if (sleepDuration.value > 10) {
    return 'This is longer than average. Ensure this reflects your typical schedule.'
  }
  if (sleepDuration.value >= 7 && sleepDuration.value <= 9) {
    return '✅ This is within the recommended range for most adults.'
  }
  return null
})

function onBedtimeChange(value: string) {
  emit('update:bedtime', value)
}
function onWakeTimeChange(value: string) {
  emit('update:wakeTime', value)
}
</script>

<style scoped>
.sleep-schedule-input > * + * {
  margin-top: 1rem;
}
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}
.section-description {
  font-size: 0.875rem;
  color: #4b5563;
}
.sleep-inputs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .sleep-inputs {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
