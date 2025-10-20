<template>
  <div :class="$style.sidebarDocInfo" class="auto-inview effect-blur-in">
    <div :class="$style.docMetaCompact">
      <div v-if="category" :class="$style.docCategory">
        {{ category }}
      </div>
      <a
        v-if="showRecentBadge"
        :href="timelineHref"
        :class="$style.recentBadge"
        class="u-focus-ring press-active"
        aria-label="查看最近更新"
        title="查看最近更新"
      >
        最近更新
        <span :class="$style.badgeCount">{{ recentCount }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import timeline from '../../../data/timeline.json'

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

const recentCount = computed(() => {
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const list = Array.isArray(timeline) ? timeline : []
  let count = 0
  for (const item of list) {
    const t = new Date(item.updateTime).getTime()
    if (!Number.isNaN(t) && now - t <= sevenDays) count++
  }
  return count
})

const showRecentBadge = computed(() => recentCount.value > 0)
const timelineHref = '/timeline'
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

.recentBadge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
}

.badgeCount {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 999px;
  font-weight: 600;
}

@media (max-width: 640px) {
  .sidebarDocInfo {
    padding: 0.75rem;
  }
}
</style>