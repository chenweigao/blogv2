<template>
  <div v-if="isVisible" :class="$style.quickTocPreview">
    <div :class="$style.quickTocHeader">
      <h4 :class="$style.quickTocTitle">Quick Navigation</h4>
      <button 
        :class="$style.quickTocClose" 
        @click="$emit('close')"
        aria-label="Close Quick TOC"
      >
        ×
      </button>
    </div>
    <div :class="$style.quickTocContent">
      <a 
        v-for="heading in headings" 
        :key="heading.anchor"
        :href="`#${heading.anchor}`"
        :class="[$style.quickTocItem, $style[`level${heading.level}`]]"
        @click="$emit('close')"
      >
        {{ heading.title }}
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  headings: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close'])
</script>

<style module>
.quickTocPreview {
  margin-top: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quickTocHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.quickTocTitle {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.quickTocClose {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.quickTocClose:hover {
  color: var(--vp-c-text-1);
}

.quickTocContent {
  padding: 0.5rem 0;
  max-height: 200px;
  overflow-y: auto;
}

.quickTocItem {
  display: block;
  padding: 0.375rem 1rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.4;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
}

.quickTocItem:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-left-color: var(--vp-c-brand-1);
}

.level2 {
  padding-left: 1.5rem;
  font-size: 0.8125rem;
}

.level3 {
  padding-left: 2rem;
  font-size: 0.75rem;
  opacity: 0.9;
}

@media (max-width: 640px) {
  .quickTocContent {
    max-height: 150px;
  }
}
</style>