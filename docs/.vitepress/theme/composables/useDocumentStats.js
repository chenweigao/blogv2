import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'

export function useDocumentStats() {
  const router = useRouter()
  
  // 响应式状态
  const readingProgress = ref(0)
  const wordCount = ref(0)
  const readingTime = ref(0)
  const headingCount = ref(0)
  const quickHeadings = ref([])
  const lastModified = ref('')
  const relatedArticles = ref([])

  const updateDocStats = () => {
    const content = document.querySelector('.vp-doc')
    if (!content) return
    
    const text = content.textContent || ''
    const words = text.trim().split(/\s+/).length
    wordCount.value = words
    readingTime.value = Math.ceil(words / 200) // 200 words per minute
    
    const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headingCount.value = headings.length
  }

  const updateQuickHeadings = () => {
    const headingElements = document.querySelectorAll('.vp-doc h1, .vp-doc h2, .vp-doc h3')
    quickHeadings.value = Array.from(headingElements).slice(0, 8).map(el => ({
      level: parseInt(el.tagName.charAt(1)),
      title: el.textContent || '',
      anchor: el.id || el.textContent?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || ''
    }))
  }

  const updateReadingProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    readingProgress.value = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
  }

  const handleScroll = () => {
    updateReadingProgress()
  }

  onMounted(() => {
    updateDocStats()
    updateReadingProgress()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // 监听路由变化
    router.onAfterRouteChanged = () => {
      setTimeout(() => {
        updateDocStats()
      }, 100)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    readingProgress,
    wordCount,
    readingTime,
    headingCount,
    quickHeadings,
    lastModified,
    relatedArticles,
    updateDocStats,
    updateQuickHeadings,
    updateReadingProgress
  }
}