<template>
  <div class="form-field">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="datetime-inputs">
      <div class="datetime-input-group">
        <input
          :id="id"
          type="date"
          :value="dateValue"
          :min="minDate"
          @input="handleDateChange"
          @blur="handleBlur"
          class="form-input"
          :class="{ 'form-input-error': error }"
          :aria-describedby="error ? `${id}-error` : undefined"
          :aria-invalid="!!error"
        />
      </div>

      <div v-if="includeTime" class="datetime-input-group">
        <input
          :id="`${id}-time`"
          type="time"
          :value="timeValue"
          @input="handleTimeChange"
          @blur="handleBlur"
          class="form-input"
          :class="{ 'form-input-error': error }"
        />
      </div>
    </div>

    <p v-if="error" :id="`${id}-error`" class="form-error">
      {{ error }}
    </p>

    <p v-if="helpText && !error" class="form-help">
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
  (e: 'update:dateValue', value: string): void
  (e: 'update:timeValue', value: string): void
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

.datetime-inputs {
  display: flex;
  gap: 0.75rem; /* gap-3 */
}

.datetime-input-group {
  flex: 1 1 0%; /* flex-1 */
}

.form-input {
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

.form-input:focus {
  outline: none;
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.form-input-error {
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
