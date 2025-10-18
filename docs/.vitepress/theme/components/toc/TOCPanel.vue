<template>
  <!-- 在固定模式下禁用Vue过渡，避免位置偏移 -->
  <Transition :name="isPinned ? '' : 'toc-slide'" appear>
    <div 
      v-if="isVisible" 
      class="toc-panel" 
      :class="{ 
        'is-pinned': isPinned, 
        'is-compact': isCompactMode,
        'is-mobile': isMobile 
      }"
      :style="panelStyle"
    >
      <!-- TOC Header -->
      <div class="toc-header">
        <div class="toc-title-section">
          <h3 class="toc-title">{{ title }}</h3>
          <div class="toc-meta">
            <span class="heading-count">{{ headingCount }} sections</span>
            <span class="reading-time">{{ estimatedReadingTime }} min</span>
          </div>
        </div>
        <div class="toc-controls">
          <button
            class="toc-control-btn toc-compact u-focus-ring"
            :class="{ 'is-active': isCompactMode }"
            @click="$emit('toggle-compact')"
            :title="isCompactMode ? 'Expand TOC' : 'Compact TOC'"
          >
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
            </svg>
          </button>
          <button
            class="toc-control-btn toc-pin u-focus-ring"
            :class="{ 'is-pinned': isPinned }"
            @click="$emit('toggle-pin')"
            :title="isPinned ? 'Unpin TOC' : 'Pin TOC'"
          >
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z"/>
            </svg>
          </button>
          <button 
            class="toc-control-btn toc-close u-focus-ring" 
            @click="$emit('close')" 
            :title="'Close TOC'"
          >
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- TOC Search -->
      <TOCSearch
        v-if="!isCompactMode && headingCount > 5"
        :show-search="true"
        :total-count="headingCount"
        :filtered-count="filteredCount"
        @search="$emit('search', $event)"
        @clear="$emit('clear-search')"
        @enter="handleSearchEnter"
        @arrow-down="handleSearchArrowDown"
        @arrow-up="handleSearchArrowUp"
        ref="tocSearch"
      />

      <!-- TOC Navigation -->
      <TOCNavigation
        :headings="headings"
        :filtered-headings="filteredHeadings"
        :active-heading="activeHeading"
        :search-query="searchQuery"
        :show-word-count="!isCompactMode"
        :show-reading-time="!isCompactMode"
        @heading-click="$emit('heading-click', $event)"
        @clear-search="$emit('clear-search')"
        ref="tocNavigation"
      />

      <!-- TOC Footer -->
      <div class="toc-footer" v-if="!isCompactMode">
        <div class="toc-actions">
          <button class="toc-action-btn" @click="$emit('scroll-to-top')" :title="'Scroll to top'">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"/>
            </svg>
            Top
          </button>
          <button class="toc-action-btn" @click="$emit('scroll-to-bottom')" :title="'Scroll to bottom'">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"/>
            </svg>
            Bottom
          </button>
          <button class="toc-action-btn" @click="handleCopyTOC" :title="'Copy TOC as text'">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
            </svg>
            Copy
          </button>
        </div>
        <div class="toc-stats">
          <div class="progress-text">{{ Math.round(readingProgress) }}% read</div>
          <div class="time-remaining" v-if="timeRemaining > 0">{{ timeRemaining }}m left</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import TOCSearch from './TOCSearch.vue'
import TOCNavigation from './TOCNavigation.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isCompactMode: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Table of Contents'
  },
  headings: {
    type: Array,
    default: () => []
  },
  filteredHeadings: {
    type: Array,
    default: () => []
  },
  activeHeading: {
    type: String,
    default: ''
  },
  searchQuery: {
    type: String,
    default: ''
  },
  readingProgress: {
    type: Number,
    default: 0
  },
  estimatedReadingTime: {
    type: Number,
    default: 1
  },
  timeRemaining: {
    type: Number,
    default: 0
  },
  panelPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
})

const emit = defineEmits([
  'close',
  'toggle-pin',
  'toggle-compact',
  'search',
  'clear-search',
  'heading-click',
  'scroll-to-top',
  'scroll-to-bottom',
  'copy-toc'
])

const tocSearch = ref(null)
const tocNavigation = ref(null)

const headingCount = computed(() => props.headings.length)
const filteredCount = computed(() => props.filteredHeadings.length)

// 计算面板样式，支持动态定位
const panelStyle = computed(() => {
  if (props.isMobile) {
    // 移动端使用固定定位
    return {}
  }
  
  return {
    position: 'fixed',
    insetInlineStart: `${props.panelPosition.x}px`,
    insetBlockStart: `${props.panelPosition.y}px`,
    zIndex: 200
  }
})

const handleSearchEnter = (event) => {
  // Focus first filtered heading
  if (props.filteredHeadings.length > 0) {
    const firstHeading = props.filteredHeadings[0]
    emit('heading-click', firstHeading.anchor, event)
  }
}

const handleSearchArrowDown = () => {
  // Focus first item in navigation
  if (tocNavigation.value) {
    tocNavigation.value.focusItem(0)
  }
}

const handleSearchArrowUp = () => {
  // Focus last item in navigation
  if (tocNavigation.value && props.filteredHeadings.length > 0) {
    tocNavigation.value.focusItem(props.filteredHeadings.length - 1)
  }
}

const handleCopyTOC = async () => {
  try {
    const success = await emit('copy-toc')
    // Could show a toast notification here
    console.log('TOC copied to clipboard')
  } catch (error) {
    console.error('Failed to copy TOC:', error)
  }
}

const focusSearch = () => {
  if (tocSearch.value) {
    tocSearch.value.focus()
  }
}

const scrollToActiveItem = () => {
  if (tocNavigation.value) {
    tocNavigation.value.scrollToActiveItem()
  }
}

defineExpose({
  focusSearch,
  scrollToActiveItem
})
</script>

<style scoped>
.toc-panel {
  width: 320px;
  max-height: 75vh;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(16px);
  overflow: hidden;
  /* 只对不影响位置的属性进行过渡 */
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  pointer-events: auto; /* 确保面板可以接收事件 */
}

/* 移动端样式 */
.toc-panel.is-mobile {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  max-height: 100vh !important;
  border-radius: 0 !important;
  z-index: 1000 !important;
}

/* 固定模式样式 - 完全静态，位置由外部panelPosition控制 */
.toc-panel.is-pinned {
  /* 位置完全由外部 panelPosition 控制，不在这里强制设置 */
  z-index: 200 !important;
  /* 添加固定模式的视觉效果 */
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2) !important;
  /* 使用 outline 替代 border，避免影响面板尺寸和位置 */
  outline: 2px solid var(--vp-c-brand-1) !important;
  outline-offset: -1px !important;
  /* 添加固定状态的背景效果 */
  background: var(--vp-c-bg) !important;
  backdrop-filter: blur(20px) !important;
  /* 完全禁用所有过渡和动画效果，避免任何位移 */
  transition: none !important;
  animation: none !important;
  transform: none !important;
  /* 确保位置稳定 */
  will-change: auto !important;
}

/* 暗色主题下的固定模式 - 完全静态 */
.dark .toc-panel.is-pinned {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5) !important;
  outline-color: var(--vp-c-brand-1) !important;
  /* 确保无动画 */
  animation: none !important;
  transition: none !important;
}

/* 紧凑模式样式 */
.toc-panel.is-compact {
  max-height: 50vh;
}

/* TOC 头部 */
.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.toc-title-section {
  flex: 1;
  min-width: 0;
}

.toc-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.toc-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.toc-controls {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.toc-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toc-control-btn:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.toc-control-btn.is-active,
.toc-control-btn.is-pinned {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* TOC 底部 */
.toc-footer {
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.toc-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.toc-action-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.toc-action-btn:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.toc-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.progress-text {
  font-weight: 500;
}

.time-remaining {
  opacity: 0.8;
}

/* 过渡动画 */
.toc-slide-enter-active,
.toc-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toc-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* 暗色主题适配 */
.dark .toc-panel {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toc-panel {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .toc-header {
    padding: 1rem;
  }
  
  .toc-footer {
    padding: 1rem;
  }
  
  .toc-actions {
    flex-direction: column;
  }
  
  .toc-action-btn {
    justify-content: flex-start;
  }
}

/* 性能优化 */
.toc-panel {
  will-change: transform, opacity;
  contain: layout style paint;
}

/* 减少动画以提升性能 */
@media (prefers-reduced-motion: reduce) {
  .toc-panel,
  .toc-slide-enter-active,
  .toc-slide-leave-active {
    transition: none !important;
  }
}
</style>