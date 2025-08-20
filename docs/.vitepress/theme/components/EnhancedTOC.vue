<template>
  <div class="enhanced-toc-container" :class="{ 'is-mobile': isMobile, 'is-pinned': isPinned }">
    <!-- TOC Toggle Button -->
    <button
      class="toc-toggle"
      :class="{ 'is-active': isVisible }"
      @click="toggleTOC"
      :title="isVisible ? 'Hide TOC' : 'Show TOC'"
      :aria-label="isVisible ? 'Hide table of contents' : 'Show table of contents'"
      :aria-expanded="isVisible"
    >
      <svg class="toc-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
      </svg>
      <span class="toc-badge" v-if="headings.length > 0">{{ headings.length }}</span>
    </button>

    <!-- Reading Progress Ring -->
    <div class="reading-progress-ring" v-if="!isMobile">
      <svg class="progress-ring" width="50" height="50">
        <circle
          class="progress-ring-background"
          cx="25"
          cy="25"
          r="20"
          fill="transparent"
          stroke="var(--vp-c-border)"
          stroke-width="2"
        />
        <circle
          class="progress-ring-progress"
          cx="25"
          cy="25"
          r="20"
          fill="transparent"
          stroke="var(--vp-c-brand-1)"
          stroke-width="2"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
          transform="rotate(-90 25 25)"
        />
      </svg>
      <div class="progress-percentage">{{ Math.round(readingProgress) }}%</div>
    </div>

    <!-- TOC Panel -->
    <Transition name="toc-slide" appear>
      <div v-if="isVisible" class="toc-panel" :class="{ 'is-pinned': isPinned, 'is-compact': isCompactMode }">
        <!-- TOC Header -->
        <div class="toc-header">
          <div class="toc-title-section">
            <h3 class="toc-title">{{ tocTitle }}</h3>
            <div class="toc-meta">
              <span class="heading-count">{{ headings.length }} sections</span>
              <span class="reading-time">{{ estimatedReadingTime }} min</span>
            </div>
          </div>
          <div class="toc-controls">
            <button
              class="toc-control-btn toc-compact"
              :class="{ 'is-active': isCompactMode }"
              @click="toggleCompactMode"
              :title="isCompactMode ? 'Expand TOC' : 'Compact TOC'"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
              </svg>
            </button>
            <button
              class="toc-control-btn toc-pin"
              :class="{ 'is-pinned': isPinned }"
              @click="togglePin"
              :title="isPinned ? 'Unpin TOC' : 'Pin TOC'"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z"/>
              </svg>
            </button>
            <button class="toc-control-btn toc-close" @click="hideTOC" :title="'Close TOC'">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- TOC Search -->
        <div class="toc-search" v-if="!isCompactMode && headings.length > 5">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Search headings..."
              @input="filterHeadings"
              @keydown.escape="clearSearch"
            />
            <button
              v-if="searchQuery"
              class="search-clear"
              @click="clearSearch"
              :title="'Clear search'"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- TOC Content -->
        <nav class="toc-nav" ref="tocNav" role="navigation" aria-label="Table of contents">
          <ul class="toc-list" role="list">
            <li
              v-for="heading in filteredHeadings"
              :key="heading.anchor"
              class="toc-item"
              :class="{
                [`toc-level-${heading.level}`]: true,
                'is-active': activeHeading === heading.anchor,
                'is-visible': heading.isVisible,
                'is-highlighted': searchQuery && heading.title.toLowerCase().includes(searchQuery.toLowerCase())
              }"
              role="listitem"
            >
              <a
                :href="`#${heading.anchor}`"
                class="toc-link"
                @click="scrollToHeading(heading.anchor, $event)"
                :title="heading.title"
                :aria-current="activeHeading === heading.anchor ? 'location' : undefined"
              >
                <span class="toc-indicator" :style="{ backgroundColor: heading.color }"></span>
                <span class="toc-text">{{ heading.title }}</span>
                <span v-if="heading.wordCount" class="toc-word-count">{{ heading.wordCount }}w</span>
              </a>
            </li>
          </ul>
          
          <!-- Empty State -->
          <div v-if="filteredHeadings.length === 0 && searchQuery" class="toc-empty-state">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <p>No headings found for "{{ searchQuery }}"</p>
          </div>
        </nav>

        <!-- TOC Footer -->
        <div class="toc-footer" v-if="!isCompactMode">
          <div class="toc-actions">
            <button class="toc-action-btn" @click="scrollToTop" :title="'Scroll to top'">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"/>
              </svg>
              Top
            </button>
            <button class="toc-action-btn" @click="scrollToBottom" :title="'Scroll to bottom'">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"/>
              </svg>
              Bottom
            </button>
            <button class="toc-action-btn" @click="copyTOC" :title="'Copy TOC as text'">
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

    <!-- Backdrop -->
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
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRouter, useData } from 'vitepress'

// Reactive state
const isVisible = ref(false)
const isPinned = ref(false)
const isCompactMode = ref(false)
const headings = ref([])
const activeHeading = ref('')
const readingProgress = ref(0)
const isMobile = ref(false)
const tocNav = ref(null)
const searchQuery = ref('')
const filteredHeadings = ref([])
const showShortcuts = ref(false)

// Router and data
const router = useRouter()
const { page } = useData()

// Computed properties
const tocTitle = computed(() => 'Table of Contents')

const estimatedReadingTime = computed(() => {
  const wordsPerMinute = 200
  const contentLength = document.querySelector('.vp-doc')?.textContent?.length || 0
  const words = contentLength / 5
  return Math.ceil(words / wordsPerMinute) || 1
})

const timeRemaining = computed(() => {
  const totalTime = estimatedReadingTime.value
  const remainingProgress = 100 - readingProgress.value
  return Math.ceil((totalTime * remainingProgress) / 100)
})

// Progress ring calculations
const circumference = computed(() => 2 * Math.PI * 20)
const progressOffset = computed(() => {
  return circumference.value - (readingProgress.value / 100) * circumference.value
})

// Methods
const toggleTOC = () => {
  isVisible.value = !isVisible.value
  if (isVisible.value) {
    updateHeadings()
  }
}

const hideTOC = () => {
  isVisible.value = false
  searchQuery.value = ''
}

const togglePin = () => {
  isPinned.value = !isPinned.value
  localStorage.setItem('toc-pinned', isPinned.value.toString())
}

const toggleCompactMode = () => {
  isCompactMode.value = !isCompactMode.value
  localStorage.setItem('toc-compact', isCompactMode.value.toString())
}

const updateHeadings = () => {
  const headingElements = document.querySelectorAll('.vp-doc h1, .vp-doc h2, .vp-doc h3, .vp-doc h4, .vp-doc h5, .vp-doc h6')
  
  headings.value = Array.from(headingElements).map((el, index) => {
    const level = parseInt(el.tagName.charAt(1))
    const title = el.textContent || ''
    let anchor = el.id
    
    if (!anchor) {
      anchor = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      el.id = anchor
    }
    
    // Calculate word count for this section
    const nextHeading = headingElements[index + 1]
    let sectionContent = ''
    let currentEl = el.nextElementSibling
    
    while (currentEl && currentEl !== nextHeading) {
      sectionContent += currentEl.textContent || ''
      currentEl = currentEl.nextElementSibling
    }
    
    const wordCount = sectionContent.trim().split(/\s+/).length
    
    // Generate color based on level
    const colors = [
      'var(--vp-c-brand-1)',
      'var(--vp-c-brand-2)',
      'var(--vp-c-text-1)',
      'var(--vp-c-text-2)',
      'var(--vp-c-text-3)',
      'var(--vp-c-border)'
    ]
    
    return {
      level,
      title,
      anchor,
      element: el,
      isVisible: false,
      wordCount: wordCount > 10 ? wordCount : null,
      color: colors[level - 1] || colors[colors.length - 1]
    }
  })
  
  filteredHeadings.value = headings.value
  updateHeadingVisibility()
}

const updateHeadingVisibility = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const heading = headings.value.find(h => h.element === entry.target)
        if (heading) {
          heading.isVisible = entry.isIntersecting
        }
      })
      updateActiveHeading()
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 0.1, 0.5, 1]
    }
  )
  
  headings.value.forEach(heading => {
    observer.observe(heading.element)
  })
}

const updateActiveHeading = () => {
  const visibleHeadings = headings.value.filter(h => h.isVisible)
  
  if (visibleHeadings.length === 0) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    let closestHeading = null
    let minDistance = Infinity
    
    headings.value.forEach(heading => {
      const element = heading.element
      const elementTop = element.offsetTop
      const distance = Math.abs(elementTop - scrollTop - 80)
      
      if (distance < minDistance) {
        minDistance = distance
        closestHeading = heading
      }
    })
    
    if (closestHeading) {
      activeHeading.value = closestHeading.anchor
    }
  } else if (visibleHeadings.length === 1) {
    activeHeading.value = visibleHeadings[0].anchor
  } else {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const viewportTop = scrollTop + 80
    
    let bestHeading = visibleHeadings[0]
    let minDistance = Infinity
    
    visibleHeadings.forEach(heading => {
      const elementTop = heading.element.offsetTop
      const distance = Math.abs(elementTop - viewportTop)
      
      if (distance < minDistance) {
        minDistance = distance
        bestHeading = heading
      }
    })
    
    activeHeading.value = bestHeading.anchor
  }
}

const scrollToHeading = (anchor, event) => {
  event.preventDefault()
  
  const linkElement = event.currentTarget || event.target.closest('a')
  if (linkElement) {
    linkElement.blur()
    setTimeout(() => {
      linkElement.blur()
      if (document.activeElement === linkElement) {
        document.activeElement.blur()
      }
    }, 0)
  }
  
  const element = document.getElementById(anchor)
  if (element) {
    activeHeading.value = anchor
    
    const headerOffset = 90
    const elementPosition = element.offsetTop
    const offsetPosition = elementPosition - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    
    history.replaceState(null, null, `#${anchor}`)
    
    setTimeout(() => {
      updateActiveHeading()
    }, 500)
    
    if (isMobile.value && !isPinned.value) {
      setTimeout(() => {
        hideTOC()
      }, 300)
    }
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

const copyTOC = async () => {
  const tocText = headings.value
    .map(h => '  '.repeat(h.level - 1) + '- ' + h.title)
    .join('\n')
  
  try {
    await navigator.clipboard.writeText(tocText)
    // Could add a toast notification here
  } catch (err) {
    console.error('Failed to copy TOC:', err)
  }
}

const filterHeadings = () => {
  if (!searchQuery.value.trim()) {
    filteredHeadings.value = headings.value
  } else {
    const query = searchQuery.value.toLowerCase()
    filteredHeadings.value = headings.value.filter(h =>
      h.title.toLowerCase().includes(query)
    )
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  filterHeadings()
}

const updateReadingProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const progress = (scrollTop / scrollHeight) * 100
  readingProgress.value = Math.min(100, Math.max(0, progress))
  
  updateActiveHeading()
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const handleScroll = () => {
  updateReadingProgress()
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
    if (isVisible.value && document.querySelector('.search-input')) {
      event.preventDefault()
      document.querySelector('.search-input').focus()
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

// Watch for search query changes
watch(searchQuery, filterHeadings)

// Lifecycle hooks
onMounted(() => {
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
  
  nextTick(() => {
    updateHeadings()
    updateReadingProgress()
  })
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
  
  if (router.onAfterRouteChanged) {
    router.onAfterRouteChanged = () => {
      nextTick(() => {
        updateHeadings()
        activeHeading.value = ''
        readingProgress.value = 0
        searchQuery.value = ''
      })
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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

/* ===== TOC 切换按钮 ===== */
.toc-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-left: auto;
  margin-bottom: 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.toc-toggle:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.toc-toggle.is-active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 6px 20px rgba(var(--vp-c-brand-rgb), 0.3);
}

.toc-icon {
  transition: transform 0.3s ease;
}

.toc-toggle.is-active .toc-icon {
  transform: rotate(180deg);
}

.toc-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 9px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* ===== 阅读进度环 ===== */
.reading-progress-ring {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-progress {
  transition: stroke-dashoffset 0.3s ease;
}

.progress-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* ===== TOC 面板 ===== */
.toc-panel {
  position: relative;
  width: 320px;
  max-height: 75vh;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(16px);
  overflow: hidden;
  margin-left: auto;
  transition: all 0.3s ease;
}

.toc-panel.is-compact {
  width: 280px;
  max-height: 60vh;
}

.toc-panel.is-pinned {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand-1);
}

.is-mobile .toc-panel {
  position: fixed;
  top: 4rem;
  right: 1rem;
  left: 1rem;
  width: auto;
  max-height:calc(100vh - 8rem);
    z-index: 1001;
}

/* ===== TOC 头部 ===== */
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.toc-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.toc-controls {
  display: flex;
  gap: 0.5rem;
}

.toc-pin,
.toc-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toc-pin:hover,
.toc-close:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.toc-pin.is-pinned {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* ===== TOC 导航 ===== */
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

/* ===== TOC 项目 ===== */
.toc-item {
  position: relative;
  margin: 0;
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
}

.toc-link:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-left-color: var(--vp-c-border);
}

.toc-item.is-active .toc-link {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-1);
  font-weight: 500;
}

.toc-indicator {
  width: 4px;
  height: 4px;
  margin-right: 0.75rem;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.toc-item.is-active .toc-indicator {
  opacity: 1;
  transform: scale(1.2);
}

.toc-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== TOC 层级样式 ===== */
.toc-level-1 .toc-link {
  padding-left: 1.25rem;
  font-weight: 500;
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

/* ===== TOC 底部 ===== */
.toc-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.toc-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

/* ===== 过渡动画 ===== */
.toc-slide-enter-active,
.toc-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-slide-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

.toc-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
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

/* ===== 响应式适配 ===== */
@media (max-width: 1280px) {
  .enhanced-toc-container {
    right: 1rem;
  }
  
  .toc-panel {
    width: 260px;
  }
}

@media (max-width: 1024px) {
  .enhanced-toc-container {
    right: 0.5rem;
  }
  
  .toc-panel {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .enhanced-toc-container {
    right: 1rem;
  }
}

/* ===== 暗色主题适配 ===== */
.dark .toc-toggle {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .toc-panel {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.dark .toc-backdrop {
  background: rgba(0, 0, 0, 0.6);
}

/* ===== 性能优化 ===== */
.toc-panel,
.toc-toggle {
  will-change: transform, opacity;
}

/* 减少动画以提升性能 */
@media (prefers-reduced-motion: reduce) {
  .toc-slide-enter-active,
  .toc-slide-leave-active,
  .toc-toggle,
  .toc-link,
  .toc-indicator {
    transition: none !important;
  }
}
</style>