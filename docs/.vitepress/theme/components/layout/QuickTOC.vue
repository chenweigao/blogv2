<template>
  <div v-if="isVisible" :class="[$style.quickTocPreview, 'motion-layer']">
    <div :class="$style.quickTocHeader">
      <h4 :class="$style.quickTocTitle">Quick Navigation</h4>
      <button 
        :class="[$style.quickTocClose, 'u-focus-ring', 'press-active', 'hover-pop', 'focus-ring-animated']" 
        @click="$emit('close')"
        aria-label="Close Quick TOC"
      >
        ×
      </button>
    </div>
    <div :class="[$style.quickTocContent, 'group', 'stagger-inview']">
      <a 
        v-for="heading in headings" 
        :key="heading.anchor"
        :href="`#${heading.anchor}`"
        :class="[$style.quickTocItem, $style[`level${heading.level}`], 'u-focus-ring', 'auto-inview', 'group-hover-underline', 'press-active', 'hover-pop', 'focus-ring-animated']"
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
  animation: slideDown var(--motion-duration-medium) var(--motion-ease-spring);
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

@media (hover: hover) {
  .quickTocClose:hover {
    color: var(--vp-c-text-1);
  }
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
  transition:
    color var(--motion-duration-short) var(--motion-ease-standard),
    background-color var(--motion-duration-short) var(--motion-ease-standard),
    border-color var(--motion-duration-short) var(--motion-ease-standard),
    transform var(--motion-duration-xshort) var(--motion-ease-decelerate);
  border-inline-start: 2px solid transparent;
}

@media (hover: hover) {
  .quickTocItem:hover {
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    border-inline-start-color: var(--vp-c-brand-1);
  }
}

.level2 {
  padding-inline-start: 1.5rem;
  font-size: 0.8125rem;
}

.level3 {
  padding-inline-start: 2rem;
  font-size: 0.75rem;
  opacity: 0.9;
}

@media (max-width: 640px) {
  .quickTocContent {
    max-height: 150px;
  }
}

/* Reduced Motion：禁用入场动画与缩短过渡 */
@media (prefers-reduced-motion: reduce) {
  .quickTocPreview {
    animation: none !important;
  }
  .quickTocItem {
    transition: none !important;
  }
}

/* 触控设备适配：过渡更短、更克制 */
@media (pointer: coarse) {
  .quickTocItem {
    transition-duration: 140ms;
  }
}

/* 全局性能/兼容实用类（以 :global 定义） */
:global(.motion-layer) {
  contain: layout paint style;
}
/* 可选的 GPU 加速提示（谨慎使用，仅合成层过渡时可加入该类） */
:global(.motion-accelerate) {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>