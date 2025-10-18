<template>
  <nav class="toc-nav" ref="tocNav" role="navigation" aria-label="Table of contents">
    <ul class="toc-list" role="list" v-if="filteredHeadings.length > 0">
      <li
        v-for="(heading, index) in filteredHeadings"
        :key="heading.anchor"
        class="toc-item"
        :class="{
          [`toc-level-${heading.level}`]: true,
          'is-active': activeHeading === heading.anchor,
          'is-visible': heading.isVisible,
          'is-highlighted': isHighlighted(heading)
        }"
        role="listitem"
        :data-index="index"
      >
        <a
          :href="`#${heading.anchor}`"
          class="toc-link"
          @click="handleClick(heading.anchor, $event)"
          :title="heading.title"
          :aria-current="activeHeading === heading.anchor ? 'location' : undefined"
        >
          <span 
            class="toc-indicator" 
            :style="{ backgroundColor: heading.color }"
          ></span>
          <span class="toc-text">{{ heading.title }}</span>
          <span 
            v-if="heading.wordCount && showWordCount" 
            class="toc-word-count"
          >
            {{ heading.wordCount }}w
          </span>
          <span 
            v-if="heading.readingTime && showReadingTime" 
            class="toc-reading-time"
          >
            {{ heading.readingTime }}min
          </span>
        </a>
      </li>
    </ul>
    
    <!-- Empty State -->
    <div v-else-if="searchQuery" class="toc-empty-state">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
      </svg>
      <p>No headings found for "{{ searchQuery }}"</p>
      <button class="clear-search-btn" @click="$emit('clear-search')">
        Clear search
      </button>
    </div>
    
    <!-- No Headings State -->
    <div v-else-if="allHeadings.length === 0" class="toc-empty-state">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
      </svg>
      <p>No headings found in this document</p>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
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
  showWordCount: {
    type: Boolean,
    default: true
  },
  showReadingTime: {
    type: Boolean,
    default: false
  },
  highlightSearch: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['heading-click', 'clear-search'])

const tocNav = ref(null)

const allHeadings = computed(() => props.headings)

const isHighlighted = (heading) => {
  if (!props.highlightSearch || !props.searchQuery) return false
  return heading.title.toLowerCase().includes(props.searchQuery.toLowerCase())
}

const handleClick = (anchor, event) => {
  event.preventDefault()
  
  // 移除焦点
  const linkElement = event.currentTarget
  if (linkElement) {
    linkElement.blur()
    setTimeout(() => {
      linkElement.blur()
      if (document.activeElement === linkElement) {
        document.activeElement.blur()
      }
    }, 0)
  }
  
  emit('heading-click', anchor, event)
}

const scrollToActiveItem = () => {
  if (!tocNav.value) return
  
  const activeItem = tocNav.value.querySelector('.toc-item.is-active')
  if (activeItem) {
    activeItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }
}

const getItemByIndex = (index) => {
  if (!tocNav.value) return null
  return tocNav.value.querySelector(`[data-index="${index}"]`)
}

const focusItem = (index) => {
  const item = getItemByIndex(index)
  if (item) {
    const link = item.querySelector('.toc-link')
    if (link) {
      link.focus()
    }
  }
}

defineExpose({
  scrollToActiveItem,
  focusItem,
  getItemByIndex
})
</script>

<style scoped>
.toc-nav {
  padding: 0.75rem 0;
  max-height: calc(70vh - 120px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-border) transparent;
}

.toc-nav::-webkit-scrollbar {
  width: 4px;
}

.toc-nav::-webkit-scrollbar-track {
  background: transparent;
}

.toc-nav::-webkit-scrollbar-thumb {
  background: var(--vp-c-border);
  border-radius: 2px;
}

.toc-nav::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.toc-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* ===== TOC 项目样式 ===== */
.toc-item {
  position: relative;
  margin: 0;
  transition: all 0.2s ease;
}

.toc-link {
  display: flex;
  align-items: center;
  padding: 0.375rem 1.25rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.4;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
  border-radius: 0 4px 4px 0;
}

.toc-link:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-left-color: var(--vp-c-border);
  transform: translateX(2px);
}

.toc-link:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
  background: var(--vp-c-brand-soft);
}

.toc-item.is-active .toc-link {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-1);
  font-weight: 500;
}

.toc-item.is-highlighted .toc-link {
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning-1);
}

.toc-indicator {
  width: 4px;
  height: 4px;
  margin-right: 0.75rem;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.6;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toc-item.is-active .toc-indicator {
  opacity: 1;
  transform: scale(1.2);
}

.toc-item.is-visible .toc-indicator {
  opacity: 0.8;
  box-shadow: 0 0 4px currentColor;
}

.toc-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.5rem;
}

.toc-word-count,
.toc-reading-time {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  opacity: 0.8;
  margin-left: 0.25rem;
  flex-shrink: 0;
}

/* ===== TOC 层级样式 ===== */
.toc-level-1 .toc-link {
  padding-left: 1.25rem;
  font-weight: 500;
  font-size: 0.9375rem;
}

.toc-level-2 .toc-link {
  padding-left: 1.75rem;
  font-size: 0.8125rem;
}

.toc-level-3 .toc-link {
  padding-left: 2.25rem;
  font-size: 0.8125rem;
  opacity: 0.9;
}

.toc-level-4 .toc-link {
  padding-left: 2.75rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

.toc-level-5 .toc-link,
.toc-level-6 .toc-link {
  padding-left: 3.25rem;
  font-size: 0.75rem;
  opacity: 0.7;
}

/* ===== 空状态样式 ===== */
.toc-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  color: var(--vp-c-text-3);
}

.toc-empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.6;
}

.toc-empty-state p {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.clear-search-btn {
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

/* ===== 响应式设计 ===== */
@media (max-width: 640px) {
  .toc-nav {
    max-height: calc(60vh - 100px);
  }
  
  .toc-link {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
  
  .toc-level-1 .toc-link {
    padding-left: 1rem;
  }
  
  .toc-level-2 .toc-link {
    padding-left: 1.5rem;
  }
  
  .toc-level-3 .toc-link {
    padding-left: 2rem;
  }
  
  .toc-level-4 .toc-link,
  .toc-level-5 .toc-link,
  .toc-level-6 .toc-link {
    padding-left: 2.5rem;
  }
  
  .toc-word-count,
  .toc-reading-time {
    display: none;
  }
}

/* ===== 暗色主题适配 ===== */
.dark .toc-item.is-highlighted .toc-link {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

/* ===== 减少动画 ===== */
@media (prefers-reduced-motion: reduce) {
  .toc-item,
  .toc-link,
  .toc-indicator,
  .clear-search-btn {
    transition: none !important;
  }
  
  .toc-link:hover {
    transform: none !important;
  }
}

/* ===== 高对比度模式 ===== */
@media (prefers-contrast: high) {
  .toc-link {
    border-left-width: 3px;
  }
  
  .toc-item.is-active .toc-link {
    border-left-width: 4px;
  }
}
</style>