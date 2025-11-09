<template>
  <div :class="['recommendation-card', `card-${color}`]">
    <div class="card-header">
      <div class="card-title-group">
        <span class="card-icon">{{ icon }}</span>
        <h3 class="card-title">{{ title }}</h3>
      </div>
    </div>

    <div class="card-body">
      <p v-if="description" class="card-description">{{ description }}</p>

      <ul v-if="items && items.length > 0" class="card-list">
        <li v-for="(item, index) in items" :key="index" class="card-list-item">
          {{ item }}
        </li>
      </ul>

      <div v-if="notes" class="card-notes">
        <p class="notes-label">Note:</p>
        <p class="notes-text">{{ notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    icon: string
    color: 'blue' | 'yellow' | 'gray' | 'green' | 'brown' | 'purple' | 'orange'
    items?: string[]
    description?: string
    notes?: string
  }>(),
  {
    items: () => [],
  },
)
</script>

<style scoped>
.recommendation-card {
  border-radius: 0.75rem;
  border: 2px solid;
  overflow: hidden;
  background-color: #ffffff;
}

.card-blue {
  border-color: #3b82f6;
}

.card-yellow {
  border-color: #fbbf24;
}

.card-gray {
  border-color: #6b7280;
}

.card-green {
  border-color: #10b981;
}

.card-brown {
  border-color: #92400e;
}

.card-purple {
  border-color: #8b5cf6;
}

.card-orange {
  border-color: #f97316;
}

.card-header {
  padding: 0.875rem 1rem;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
}

.card-blue .card-header {
  --header-bg: #eff6ff;
  --border-color: #bfdbfe;
}

.card-yellow .card-header {
  --header-bg: #fef3c7;
  --border-color: #fde68a;
}

.card-gray .card-header {
  --header-bg: #f3f4f6;
  --border-color: #d1d5db;
}

.card-green .card-header {
  --header-bg: #d1fae5;
  --border-color: #a7f3d0;
}

.card-brown .card-header {
  --header-bg: #fef3c7;
  --border-color: #fde68a;
}

.card-purple .card-header {
  --header-bg: #f5f3ff;
  --border-color: #ddd6fe;
}

.card-orange .card-header {
  --header-bg: #ffedd5;
  --border-color: #fed7aa;
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.card-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.card-body {
  padding: 1rem;
}

.card-description {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-list-item {
  font-size: 0.875rem;
  color: #374151;
  padding: 0.5rem 0;
  padding-left: 1.25rem;
  position: relative;
  line-height: 1.5;
}

.card-list-item::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 700;
}

.card-list-item:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
}

.card-notes {
  margin-top: 0.875rem;
  padding: 0.75rem;
  background-color: #fef3c7;
  border-radius: 0.375rem;
  border: 1px solid #fde68a;
}

.notes-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.notes-text {
  font-size: 0.875rem;
  color: #78350f;
  line-height: 1.5;
  margin: 0;
}

@media print {
  .recommendation-card {
    page-break-inside: avoid;
  }
}
</style>

