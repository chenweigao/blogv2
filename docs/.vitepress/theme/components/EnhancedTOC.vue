<template>
  <div class="enhanced-toc-container" :class="{ 'is-mobile': isMobile, 'is-pinned': isPinned }">
    <!-- TOC Toggle Button with Integrated Progress Ring -->
    <TOCToggleButton
      :is-active="isVisible"
      :heading-count="headings.length"
      :is-draggable="true"
      :position="dragPosition"
      :reading-progress="readingProgress"
      :show-progress="!isMobile && showProgressRing"
      @click="toggleTOC"
      @drag-start="handleDragStart"
      @drag-move="handleDragMove"
      @drag-end="handleDragEnd"
      ref="toggleButton"
    />

    <!-- TOC Panel -->
    <TOCPanel
      :is-visible="isVisible"
      :is-pinned="isPinned"
      :is-compact-mode="isCompactMode"
      :is-mobile="isMobile"
      :title="tocTitle"
      :headings="headings"
      :filtered-headings="filteredHeadings"
      :active-heading="activeHeading"
      :search-query="searchQuery"
      :reading-progress="readingProgress"
      :estimated-reading-time="estimatedReadingTime"
      :time-remaining="timeRemaining"
      @close="hideTOC"
      @toggle-pin="togglePin"
      @toggle-compact="toggleCompactMode"
      @search="handleSearch"
      @clear-search="handleClearSearch"
      @heading-click="handleHeadingClick"
      @scroll-to-top="scrollToTop"
      @scroll-to-bottom="scrollToBottom"
      @copy-toc="handleCopyTOC"
      ref="tocPanel"
    />

    <!-- Backdrop for Mobile -->
    <div
      v-if="isVisible && isMobile"
      class="toc-backdrop"
      @click="hideTOC"
      role="button"
      :aria-label="'Close table of contents'"
    ></div>

    <!-- Keyboard Shortcuts Tooltip -->
    <div v-if="showShortcuts" class="shortcuts-tooltip">
      <div class="shortcuts-header">Keyboard Shortcuts</div>
      <div class="shortcuts-list">
        <div class="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>K</kbd> <span>Toggle TOC</span>
        </div>
        <div class="shortcut-item">
          <kbd>Esc</kbd> <span>Close TOC</span>
        </div>
        <div class="shortcut-item">
          <kbd>/</kbd> <span>Search headings</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import TOCToggleButton from './toc/TOCToggleButton.vue'
import TOCPanel from './toc/TOCPanel.vue'
import { useTOC } from '../composables/useTOC.js'
import { useDragAndDrop } from '../composables/useDragAndDrop.js'

// VitePress data
const { page, frontmatter } = useData()

// Component refs
const toggleButton = ref(null)
const tocPanel = ref(null)

// TOC functionality
const {
  headings,
  filteredHeadings,
  activeHeading,
  readingProgress,
  searchQuery,
  estimatedReadingTime,
  timeRemaining,
  scrollToHeading,
  scrollToTop,
  scrollToBottom,
  copyTOC,
  filterHeadings,
  clearSearch
} = useTOC()

// Drag and drop functionality
const {
  isDragging,
  position: dragPosition
} = useDragAndDrop({
  storageKey: 'enhanced-toc-position',
  defaultPosition: { x: 0, y: 0 },
  constrainToViewport: true,
  snapToEdges: true,
  snapThreshold: 30
})

// Local state
const isVisible = ref(false)
const isPinned = ref(false)
const isCompactMode = ref(false)
const isMobile = ref(false)
const showShortcuts = ref(false)
const showProgressRing = ref(true)

// Computed properties
const tocTitle = computed(() => 'Table of Contents')

const isDocPage = computed(() => {
  if (!page.value) return false
  
  // Exclude special pages
  const excludePages = ['/', '/index', '/home', '/timeline', '/search', '/about']
  const currentPath = page.value.relativePath?.replace(/\.md$/, '') || ''
  const normalizedPath = '/' + currentPath
  
  if (excludePages.includes(normalizedPath) || excludePages.includes('/' + currentPath)) {
    return false
  }
  
  // Check frontmatter
  const fm = frontmatter.value || {}
  if (fm.layout === 'home' || fm.layout === 'page') {
    return false
  }
  
  return true
})

// Methods
const toggleTOC = () => {
  if (isDragging.value) return
  
  isVisible.value = !isVisible.value
  if (isVisible.value && tocPanel.value) {
    setTimeout(() => {
      tocPanel.value.scrollToActiveItem()
    }, 100)
  }
}

const hideTOC = () => {
  isVisible.value = false
  clearSearch()
}

const togglePin = () => {
  isPinned.value = !isPinned.value
  localStorage.setItem('toc-pinned', isPinned.value.toString())
}

const toggleCompactMode = () => {
  isCompactMode.value = !isCompactMode.value
  localStorage.setItem('toc-compact', isCompactMode.value.toString())
}

const handleSearch = (query) => {
  filterHeadings(query)
}

const handleClearSearch = () => {
  clearSearch()
}

const handleHeadingClick = (anchor, event) => {
  scrollToHeading(anchor)
  
  if (isMobile.value && !isPinned.value) {
    setTimeout(() => {
      hideTOC()
    }, 300)
  }
}

const handleCopyTOC = async () => {
  return await copyTOC()
}

// Drag handlers
const handleDragStart = (position) => {
  console.log('Drag started at:', position)
}

const handleDragMove = (position) => {
  // Position is automatically updated by the drag composable
}

const handleDragEnd = (position) => {
  console.log('Drag ended at:', position)
}

// Utility functions
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const handleResize = () => {
  checkMobile()
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isVisible.value) {
    hideTOC()
  }
  
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    toggleTOC()
  }
  
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    if (isVisible.value && tocPanel.value) {
      event.preventDefault()
      tocPanel.value.focusSearch()
    }
  }
  
  if ((event.ctrlKey || event.metaKey) && event.key === '?') {
    event.preventDefault()
    showShortcuts.value = !showShortcuts.value
    setTimeout(() => {
      showShortcuts.value = false
    }, 3000)
  }
}

// Lifecycle
onMounted(() => {
  if (!isDocPage.value) return
  
  checkMobile()
  
  // Restore saved states
  const savedPinState = localStorage.getItem('toc-pinned')
  if (savedPinState === 'true') {
    isPinned.value = true
    isVisible.value = true
  }
  
  const savedCompactState = localStorage.getItem('toc-compact')
  if (savedCompactState === 'true') {
    isCompactMode.value = true
  }
  
  // Add event listeners
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* ===== TOC 容器样式 ===== */
.enhanced-toc-container {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  z-index: 100;
  max-width: 320px;
  font-family: var(--vp-font-family-base);
  transition: all 0.3s ease;
}

.enhanced-toc-container.is-mobile {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transform: none;
  max-width: none;
  z-index: 1000;
}

.enhanced-toc-container.is-pinned {
  position: fixed;
  top: 6rem;
  transform: none;
}

/* ===== 背景遮罩 ===== */
.toc-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

/* ===== 快捷键提示 ===== */
.shortcuts-tooltip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(16px);
  z-index: 200;
  animation: fadeInScale 0.3s ease;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.shortcuts-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.shortcut-item kbd {
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

/* ===== 响应式设计 ===== */
@media (max-width: 1280px) {
  .enhanced-toc-container {
    right: 1rem;
  }
}

@media (max-width: 1024px) {
  .enhanced-toc-container {
    right: 0.5rem;
  }
}

@media (max-width: 768px) {
  .enhanced-toc-container {
    right: 1rem;
  }
}

/* ===== 暗色主题适配 ===== */
.dark .toc-backdrop {
  background: rgba(0, 0, 0, 0.6);
}

.dark .shortcuts-tooltip {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* ===== 性能优化 ===== */
.enhanced-toc-container {
  will-change: transform, opacity;
}

/* 减少动画以提升性能 */
@media (prefers-reduced-motion: reduce) {
  .enhanced-toc-container,
  .shortcuts-tooltip {
    transition: none !important;
    animation: none !important;
  }
}
</style>