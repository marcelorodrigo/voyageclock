<template>
  <div class="mb-0">
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
    <input
      :id="id"
      type="time"
      :value="modelValue"
      :class="[
        'w-full px-3 py-2 border rounded-md shadow-sm transition focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white',
        error ? 'border-red-500' : 'border-gray-300',
      ]"
      :aria-describedby="error ? `${id}-error` : undefined"
      :aria-invalid="!!error"
      @input="onInput"
      @blur="$emit('blur')"
    >
    <p
      v-if="error"
      :id="`${id}-error`"
      class="mt-2 text-sm text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  modelValue: string
  label: string
  error?: string
  required?: boolean
}
defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
