<template>
  <div class="mb-6">
    <label
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500"
      >*</span>
    </label>

    <div class="flex gap-3">
      <div class="flex-1">
        <input
          :id="id"
          type="date"
          :value="dateValue"
          :min="minDate"
          :class="[
            'w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white',
            error ? 'border-red-500' : 'border-gray-300',
          ]"
          :aria-describedby="error ? `${id}-error` : undefined"
          :aria-invalid="!!error"
          @input="handleDateChange"
          @blur="handleBlur"
        >
      </div>

      <div
        v-if="includeTime"
        class="flex-1"
      >
        <input
          :id="`${id}-time`"
          type="time"
          :value="timeValue"
          :class="[
            'w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white',
            error ? 'border-red-500' : 'border-gray-300',
          ]"
          @input="handleTimeChange"
          @blur="handleBlur"
        >
      </div>
    </div>

    <p
      v-if="error"
      :id="`${id}-error`"
      class="mt-2 text-sm text-red-600"
    >
      {{ error }}
    </p>

    <p
      v-if="helpText && !error"
      class="mt-2 text-sm text-gray-500"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { getMinDepartureDate } from '~/utils/dateTimeUtils'

interface Props {
  id: string
  label: string
  dateValue: string
  timeValue?: string
  includeTime?: boolean
  required?: boolean
  error?: string
  helpText?: string
  minDate?: string
}

interface Emits {
  (e: 'update:dateValue' | 'update:timeValue', value: string): void
  (e: 'blur'): void
}

withDefaults(defineProps<Props>(), {
  includeTime: false,
  required: false,
  minDate: getMinDepartureDate(),
})

const emit = defineEmits<Emits>()

function handleDateChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:dateValue', target.value)
}

function handleTimeChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:timeValue', target.value)
}

function handleBlur() {
  emit('blur')
}
</script>
