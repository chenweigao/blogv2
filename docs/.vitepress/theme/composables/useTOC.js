import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useData } from 'vitepress'

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export function useTOC() {
  // Reactive state
  const headings = ref([])
  const activeHeading = ref('')
  const readingProgress = ref(0)
  const searchQuery = ref('')
  const filteredHeadings = ref([])
  
  // Router and data
  const router = useRouter()
  const { page } = useData()
  
  // Computed properties with SSR safety
  const estimatedReadingTime = computed(() => {
    if (!isBrowser) return 1
    
    const wordsPerMinute = 200
    const contentElement = document.querySelector('.vp-doc')
    const contentLength = contentElement?.textContent?.length || 0
    const words = contentLength / 5
    return Math.ceil(words / wordsPerMinute) || 1
  })
  
  const timeRemaining = computed(() => {
    const totalTime = estimatedReadingTime.value
    const remainingProgress = 100 - readingProgress.value
    return Math.ceil((totalTime * remainingProgress) / 100)
  })
  
  // Intersection Observer for heading visibility
  let headingObserver = null
  
  // Methods with SSR safety
  const updateHeadings = () => {
    if (!isBrowser) return
    
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
      const readingTime = Math.ceil(wordCount / 200)
      
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
        readingTime: readingTime > 1 ? readingTime : null,
        color: colors[level - 1] || colors[colors.length - 1]
      }
    })
    
    filteredHeadings.value = headings.value
    updateHeadingVisibility()
  }
  
  const updateHeadingVisibility = () => {
    if (!isBrowser) return
    
    if (headingObserver) {
      headingObserver.disconnect()
    }
    
    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') return
    
    headingObserver = new IntersectionObserver(
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
      headingObserver.observe(heading.element)
    })
  }
  
  const updateActiveHeading = () => {
    if (!isBrowser) return
    
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
  
  const scrollToHeading = (anchor, smooth = true) => {
    if (!isBrowser) return
    
    const element = document.getElementById(anchor)
    if (element) {
      activeHeading.value = anchor
      
      const headerOffset = 90
      const elementPosition = element.offsetTop
      const offsetPosition = elementPosition - headerOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: smooth ? 'smooth' : 'instant'
      })
      
      if (typeof history !== 'undefined') {
        history.replaceState(null, null, `#${anchor}`)
      }
      
      setTimeout(() => {
        updateActiveHeading()
      }, smooth ? 500 : 100)
    }
  }
  
  const scrollToTop = () => {
    if (!isBrowser) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const scrollToBottom = () => {
    if (!isBrowser) return
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }
  
  const copyTOC = async () => {
    if (!isBrowser || typeof navigator === 'undefined' || !navigator.clipboard) {
      return false
    }
    
    const tocText = headings.value
      .map(h => '  '.repeat(h.level - 1) + '- ' + h.title)
      .join('\n')
    
    try {
      await navigator.clipboard.writeText(tocText)
      return true
    } catch (err) {
      console.error('Failed to copy TOC:', err)
      return false
    }
  }
  
  const filterHeadings = (query) => {
    searchQuery.value = query
    if (!query.trim()) {
      filteredHeadings.value = headings.value
    } else {
      const lowerQuery = query.toLowerCase()
      filteredHeadings.value = headings.value.filter(h =>
        h.title.toLowerCase().includes(lowerQuery)
      )
    }
  }
  
  const clearSearch = () => {
    searchQuery.value = ''
    filteredHeadings.value = headings.value
  }
  
  const updateReadingProgress = () => {
    if (!isBrowser) return
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    readingProgress.value = Math.min(100, Math.max(0, progress))
    
    updateActiveHeading()
  }
  
  // Event handlers
  const handleScroll = () => {
    if (!isBrowser) return
    updateReadingProgress()
  }
  
  // Lifecycle
  const initialize = () => {
    if (!isBrowser) return
    
    nextTick(() => {
      updateHeadings()
      updateReadingProgress()
    })
    
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
  
  const cleanup = () => {
    if (!isBrowser) return
    
    if (headingObserver) {
      headingObserver.disconnect()
      headingObserver = null
    }
    
    window.removeEventListener('scroll', handleScroll)
  }
  
  // Auto initialize - only on client side
  onMounted(() => {
    if (isBrowser) {
      initialize()
    }
  })
  
  onUnmounted(() => {
    if (isBrowser) {
      cleanup()
    }
  })
  
  // Watch for page changes to update TOC
  if (isBrowser) {
    watch(
      () => page.value.filePath,
      (newPath, oldPath) => {
        if (newPath !== oldPath) {
          // Reset state
          headings.value = []
          activeHeading.value = ''
          readingProgress.value = 0
          searchQuery.value = ''
          filteredHeadings.value = []
          
          // Update headings after DOM is ready
          nextTick(() => {
            setTimeout(() => {
              updateHeadings()
              updateReadingProgress()
            }, 100) // Small delay to ensure DOM is fully rendered
          })
        }
      },
      { immediate: false }
    )
  }
  
  return {
    // State
    headings,
    filteredHeadings,
    activeHeading,
    readingProgress,
    searchQuery,
    estimatedReadingTime,
    timeRemaining,
    
    // Methods
    scrollToHeading,
    scrollToTop,
    scrollToBottom,
    copyTOC,
    filterHeadings,
    clearSearch,
    updateHeadings,
    updateReadingProgress,
    
    // Lifecycle
    initialize,
    cleanup
  }
}