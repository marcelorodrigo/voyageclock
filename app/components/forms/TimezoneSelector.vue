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

    <select
      :id="id"
      :value="modelValue"
      :class="[
        'w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white',
        error ? 'border-red-500' : 'border-gray-300',
      ]"
      :aria-describedby="error ? `${id}-error` : undefined"
      :aria-invalid="!!error"
      @change="handleChange"
      @blur="handleBlur"
    >
      <option
        value=""
        disabled
      >
        {{ placeholder }}
      </option>

      <optgroup
        v-for="region in groupedTimezones"
        :key="region.name"
        :label="region.name"
      >
        <option
          v-for="tz in region.timezones"
          :key="tz.value"
          :value="tz.value"
        >
          {{ tz.label }} ({{ formatOffset(tz.offset) }})
        </option>
      </optgroup>
    </select>

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
import { computed } from 'vue'
import { getCommonTimezones, formatTimezoneOffset } from '~/utils/timezoneService'
import type { TimezoneOption } from '~/types/travel'

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
