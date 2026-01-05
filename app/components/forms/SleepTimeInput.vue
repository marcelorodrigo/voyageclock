<template>
  <div class="form-field">
    <label
      :for="id"
      class="form-label"
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
      class="form-input"
      :class="{ 'form-input-error': error }"
      :aria-describedby="error ? `${id}-error` : undefined"
      :aria-invalid="!!error"
      @input="onInput"
      @blur="$emit('blur')"
    >
    <p
      v-if="error"
      :id="`${id}-error`"
      class="form-error"
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

<style scoped>
.form-field {
  margin-bottom: 0; /* mb-0 */
}
.form-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #374151; /* gray-700 */
  margin-bottom: 0.5rem;
}
.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #fff;
}
.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
}
.form-input-error {
  border-color: #ef4444;
}
.form-error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
}
</style>
