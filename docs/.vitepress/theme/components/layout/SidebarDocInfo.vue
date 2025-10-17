<template>
  <div :class="$style.sidebarDocInfo" class="auto-inview effect-blur-in">
    <div :class="$style.docMetaCompact">
      <div v-if="category" :class="$style.docCategory">
        {{ category }}
      </div>
      <div v-if="date" :class="$style.docDate">
        {{ formatDate(date) }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  }
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style module>
.sidebarDocInfo {
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.docMetaCompact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.docCategory {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.docDate {
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .sidebarDocInfo {
    padding: 0.75rem;
  }
}
</style>