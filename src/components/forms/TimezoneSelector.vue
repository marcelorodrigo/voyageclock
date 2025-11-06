<template>
  <div class="form-field">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <select
      :id="id"
      :value="modelValue"
      @change="handleChange"
      @blur="handleBlur"
      class="form-select"
      :class="{ 'form-select-error': error }"
      :aria-describedby="error ? `${id}-error` : undefined"
      :aria-invalid="!!error"
    >
      <option value="" disabled>{{ placeholder }}</option>

      <optgroup v-for="region in groupedTimezones" :key="region.name" :label="region.name">
        <option v-for="tz in region.timezones" :key="tz.value" :value="tz.value">
          {{ tz.label }} ({{ formatOffset(tz.offset) }})
        </option>
      </optgroup>
    </select>

    <p v-if="error" :id="`${id}-error`" class="form-error">
      {{ error }}
    </p>

    <p v-if="helpText && !error" class="form-help">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getCommonTimezones, formatTimezoneOffset } from '@/services/timezoneService'
import type { TimezoneOption } from '@/types/travel'

interface Props {
  id: string
  label: string
  modelValue: string
  placeholder?: string
  required?: boolean
  error?: string
  helpText?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Select a timezone',
  required: false,
})

const emit = defineEmits<Emits>()

const timezones = getCommonTimezones()

const groupedTimezones = computed(() => {
  const regions = new Map<string, TimezoneOption[]>()

  for (const tz of timezones) {
    const region = tz.region || 'Other'
    if (!regions.has(region)) {
      regions.set(region, [])
    }
    regions.get(region)!.push(tz)
  }

  // Sort regions and timezones
  return Array.from(regions.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, timezones]) => ({
      name,
      timezones: timezones.sort((a, b) => a.offset - b.offset),
    }))
})

function formatOffset(offsetMinutes: number): string {
  return formatTimezoneOffset(offsetMinutes)
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

function handleBlur() {
  emit('blur')
}
</script>

<style scoped>
.form-field {
  margin-bottom: 1.5rem; /* mb-6 */
}

.form-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #374151; /* gray-700 */
  margin-bottom: 0.5rem;
}

.form-select {
  width: 100%;
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03); /* shadow-sm */
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #ffffff;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.form-select-error {
  border-color: #ef4444; /* red-500 */
}

.form-error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626; /* red-600 */
}

.form-help {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280; /* gray-500 */
}
</style>
