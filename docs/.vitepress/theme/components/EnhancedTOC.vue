<template>
  <div class="enhanced-toc-container" :class="{ 'is-mobile': isMobile }">
    <!-- TOC Toggle Button -->
    <button
      class="toc-toggle"
      :class="{ 'is-active': isVisible }"
      @click="toggleTOC"
      :title="isVisible ? 'Hide TOC' : 'Show TOC'"
    >
      <svg class="toc-icon" viewBox="0 0 24 24" width="20" height="20">
        <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
      </svg>
    </button>

    <!-- Reading Progress Bar -->
    <div class="reading-progress" :style="{ width: readingProgress + '%' }"></div>

    <!-- TOC Panel -->
    <Transition name="toc-slide">
      <div v-if="isVisible" class="toc-panel" :class="{ 'is-pinned': isPinned }">
        <!-- TOC Header -->
        <div class="toc-header">
          <h3 class="toc-title">{{ tocTitle }}</h3>
          <div class="toc-controls">
            <button
              class="toc-pin"
              :class="{ 'is-pinned': isPinned }"
              @click="togglePin"
              :title="isPinned ? 'Unpin TOC' : 'Pin TOC'"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z"/>
              </svg>
            </button>
            <button class="toc-close" @click="hideTOC" title="Close TOC">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- TOC Content -->
        <nav class="toc-nav" ref="tocNav">
          <ul class="toc-list">
            <li
              v-for="heading in headings"
              :key="heading.anchor"
              class="toc-item"
              :class="{
                [`toc-level-${heading.level}`]: true,
                'is-active': activeHeading === heading.anchor,
                'is-visible': heading.isVisible
              }"
            >
              <a
                :href="`#${heading.anchor}`"
                class="toc-link"
                @click="scrollToHeading(heading.anchor, $event)"
                :title="heading.title"
              >
                <span class="toc-indicator"></span>
                <span class="toc-text">{{ heading.title }}</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- TOC Footer -->
        <div class="toc-footer">
          <div class="toc-stats">
            <span class="heading-count">{{ headings.length }} headings</span>
            <span class="reading-time">{{ estimatedReadingTime }} min read</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <div
      v-if="isVisible && isMobile"
      class="toc-backdrop"
      @click="hideTOC"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vitepress'

// Reactive state
const isVisible = ref(false)
const isPinned = ref(false)
const headings = ref([])
const activeHeading = ref('')
const readingProgress = ref(0)
const isMobile = ref(false)
const tocNav = ref(null)

// Computed properties
const tocTitle = computed(() => 'Table of Contents')

const estimatedReadingTime = computed(() => {
  // Estimate reading time based on content length
  const wordsPerMinute = 200
  const contentLength = document.querySelector('.vp-doc')?.textContent?.length || 0
  const words = contentLength / 5 // Rough estimate: 5 characters per word
  return Math.ceil(words / wordsPerMinute) || 1
})

// Router
const router = useRouter()

// Methods
const toggleTOC = () => {
  isVisible.value = !isVisible.value
  if (isVisible.value) {
    updateHeadings()
  }
}

const hideTOC = () => {
  isVisible.value = false
}

const togglePin = () => {
  isPinned.value = !isPinned.value
  // Save pin state to localStorage
  localStorage.setItem('toc-pinned', isPinned.value.toString())
}

const updateHeadings = () => {
  const headingElements = document.querySelectorAll('.vp-doc h1, .vp-doc h2, .vp-doc h3, .vp-doc h4, .vp-doc h5, .vp-doc h6')
  
  headings.value = Array.from(headingElements).map((el, index) => {
    const level = parseInt(el.tagName.charAt(1))
    const title = el.textContent || ''
    let anchor = el.id
    
    // Generate anchor if not present
    if (!anchor) {
      anchor = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      el.id = anchor
    }
    
    return {
      level,
      title,
      anchor,
      element: el,
      isVisible: false
    }
  })
  
  // Update heading visibility
  updateHeadingVisibility()
}

const updateHeadingVisibility = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      // 更新可见性状态
      entries.forEach((entry) => {
        const heading = headings.value.find(h => h.element === entry.target)
        if (heading) {
          heading.isVisible = entry.isIntersecting
        }
      })
      
      // 选择最合适的活跃标题
      updateActiveHeading()
    },
    {
      // 调整检测区域：顶部留出更多空间，确保准确检测
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 0.1, 0.5, 1]
    }
  )
  
  headings.value.forEach(heading => {
    observer.observe(heading.element)
  })
}

// 新增：更智能的活跃标题选择逻辑
const updateActiveHeading = () => {
  const visibleHeadings = headings.value.filter(h => h.isVisible)
  
  if (visibleHeadings.length === 0) {
    // 如果没有可见标题，选择最接近顶部的标题
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    let closestHeading = null
    let minDistance = Infinity
    
    headings.value.forEach(heading => {
      const element = heading.element
      const elementTop = element.offsetTop
      const distance = Math.abs(elementTop - scrollTop - 80) // 80px 是 header 偏移
      
      if (distance < minDistance) {
        minDistance = distance
        closestHeading = heading
      }
    })
    
    if (closestHeading) {
      activeHeading.value = closestHeading.anchor
    }
  } else if (visibleHeadings.length === 1) {
    // 只有一个可见标题
    activeHeading.value = visibleHeadings[0].anchor
  } else {
    // 多个可见标题，选择最接近视口顶部的
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const viewportTop = scrollTop + 80 // 考虑 header 高度
    
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
  
  // 立即移除焦点，清除点击边框
  if (event.target) {
    event.target.blur()
  }
  
  const element = document.getElementById(anchor)
  if (element) {
    // 立即更新活跃标题，避免延迟
    activeHeading.value = anchor
    
    // 计算更精确的偏移量
    const headerOffset = 90 // 增加偏移量，确保标题不被遮挡
    const elementPosition = element.offsetTop
    const offsetPosition = elementPosition - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    
    // Update URL without triggering navigation
    history.replaceState(null, null, `#${anchor}`)
    
    // 滚动完成后再次确认活跃标题
    setTimeout(() => {
      updateActiveHeading()
    }, 500) // 等待平滑滚动完成
    
    // Hide TOC on mobile after navigation
    if (isMobile.value && !isPinned.value) {
      setTimeout(() => {
        hideTOC()
      }, 300)
    }
  }
}

const updateReadingProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const progress = (scrollTop / scrollHeight) * 100
  readingProgress.value = Math.min(100, Math.max(0, progress))
  
  // 在滚动时也更新活跃标题
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
  // ESC key to close TOC
  if (event.key === 'Escape' && isVisible.value) {
    hideTOC()
  }
  
  // Ctrl/Cmd + K to toggle TOC
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    toggleTOC()
  }
}

// Lifecycle hooks
onMounted(() => {
  // Check mobile
  checkMobile()
  
  // Restore pin state
  const savedPinState = localStorage.getItem('toc-pinned')
  if (savedPinState === 'true') {
    isPinned.value = true
    isVisible.value = true
  }
  
  // Initial setup
  nextTick(() => {
    updateHeadings()
    updateReadingProgress()
  })
  
  // Event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
  
  // Watch for route changes
  router.onAfterRouteChanged = () => {
    nextTick(() => {
      updateHeadings()
      activeHeading.value = ''
      readingProgress.value = 0
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
})
</script>