<template>
  <div class="scroll-animations">
    <!-- 滚动进度指示器 -->
    <div class="scroll-progress" :style="{ width: `${scrollProgress}%` }"></div>
    
    <!-- 返回顶部按钮 -->
    <Transition name="back-to-top">
      <button 
        v-if="showBackToTop" 
        class="back-to-top-btn"
        @click="scrollToTop"
        :title="'返回顶部'"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </Transition>
    
    <!-- 阅读进度环 -->
    <div class="reading-progress" v-if="showReadingProgress">
      <svg class="progress-ring" width="60" height="60">
        <circle
          class="progress-ring-bg"
          cx="30"
          cy="30"
          r="26"
          fill="transparent"
          stroke="var(--vp-c-border)"
          stroke-width="2"
        />
        <circle
          class="progress-ring-progress"
          cx="30"
          cy="30"
          r="26"
          fill="transparent"
          stroke="var(--vp-c-brand-1)"
          stroke-width="3"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
          transform="rotate(-90 30 30)"
        />
      </svg>
      <div class="progress-percentage">{{ Math.round(scrollProgress) }}%</div>
    </div>
    
    <!-- 章节导航指示器 -->
    <div class="chapter-navigator" v-if="chapters.length > 0">
      <div class="chapter-dots">
        <div 
          v-for="(chapter, index) in chapters" 
          :key="chapter.id"
          class="chapter-dot"
          :class="{ active: activeChapter === index }"
          @click="scrollToChapter(chapter.id)"
          :title="chapter.title"
        >
          <span class="dot-number">{{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const scrollProgress = ref(0)
const showBackToTop = ref(false)
const showReadingProgress = ref(false)
const activeChapter = ref(0)
const chapters = ref([])
let io = null

// 进度环计算
const circumference = 2 * Math.PI * 26
const progressOffset = computed(() => {
  return circumference - (scrollProgress.value / 100) * circumference
})

let ticking = false

// 滚动处理函数
function handleScroll() {
  if (!ticking) {
    requestAnimationFrame(updateScrollState)
    ticking = true
  }
}

function updateScrollState() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  
  // 更新滚动进度
  scrollProgress.value = Math.min((scrollTop / scrollHeight) * 100, 100)
  
  // 显示/隐藏返回顶部按钮
  showBackToTop.value = scrollTop > 300
  
  // 显示/隐藏阅读进度
  showReadingProgress.value = scrollTop > 100
  
  // 更新活跃章节
  updateActiveChapter(scrollTop)
  
  // 触发滚动动画
  triggerScrollAnimations()
  
  ticking = false
}

// 更新活跃章节
function updateActiveChapter(scrollTop) {
  for (let i = chapters.value.length - 1; i >= 0; i--) {
    const element = document.getElementById(chapters.value[i].id)
    if (element && element.offsetTop <= scrollTop + 100) {
      activeChapter.value = i
      break
    }
  }
}

// 触发滚动动画
function triggerScrollAnimations() {
  if (io) return
  const elements = document.querySelectorAll('.scroll-animate')
  const windowHeight = window.innerHeight
  const scrollTop = window.pageYOffset
  elements.forEach(element => {
    const elementTop = element.offsetTop
    const elementHeight = element.offsetHeight
    
    // 元素进入视口时触发动画
    if (scrollTop + windowHeight > elementTop + 100 && 
        scrollTop < elementTop + elementHeight) {
      element.classList.add('animate')
    }
  })
}

// 返回顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 滚动到指定章节
function scrollToChapter(chapterId) {
  const element = document.getElementById(chapterId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 收集页面章节
function collectChapters() {
  const headings = document.querySelectorAll('h1, h2, h3')
  chapters.value = Array.from(headings).map((heading, index) => ({
    id: heading.id || `heading-${index}`,
    title: heading.textContent,
    level: parseInt(heading.tagName.charAt(1))
  })).filter(chapter => chapter.id)
  
  // 为没有 id 的标题添加 id
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`
    }
  })
}

// 添加滚动动画类到元素
function addScrollAnimationClasses() {
  const selectors = [
    '.vp-doc p',
    '.vp-doc ul',
    '.vp-doc ol',
    '.vp-doc blockquote',
    '.vp-doc div[class*="language-"]',
    '.vp-doc table',
    '.info-box'
  ]
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(element => {
      element.classList.add('scroll-animate')
    })
  })
}

// 平滑滚动到锚点
function handleAnchorClick(event) {
  const link = event.target.closest('a[href^="#"]')
  if (link) {
    event.preventDefault()
    const targetId = link.getAttribute('href').substring(1)
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
}

function setupIntersectionObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  const options = { root: null, rootMargin: '0px', threshold: 0.1 }
  io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate')
      }
    })
  }, options)
  const elements = document.querySelectorAll('.scroll-animate')
  elements.forEach(el => io.observe(el))
}

onMounted(() => {
  // 延迟执行，确保 DOM 已渲染
  setTimeout(() => {
    collectChapters()
    addScrollAnimationClasses()
    setupIntersectionObserver()
    updateScrollState()
  }, 100)
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleAnchorClick)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleAnchorClick)
  if (io) {
    io.disconnect()
    io = null
  }
})
</script>

<style scoped>
.scroll-animations {
  position: relative;
}

/* 滚动进度条 */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  z-index: 1000;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px var(--vp-c-brand-1);
}

/* 返回顶部按钮 */
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 999;
}

.back-to-top-btn:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.back-to-top-btn svg {
  width: 24px;
  height: 24px;
}

/* 返回顶部按钮动画 */
.back-to-top-enter-active {
  transition: all 0.3s ease;
}

.back-to-top-leave-active {
  transition: all 0.3s ease;
}

.back-to-top-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* 阅读进度环 */
.reading-progress {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  width: 60px;
  height: 60px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-progress {
  transition: stroke-dashoffset 0.1s ease;
  filter: drop-shadow(0 0 3px var(--vp-c-brand-1));
}

.progress-percentage {
  position: absolute;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

/* 章节导航指示器 */
.chapter-navigator {
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 998;
}

.chapter-dots {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chapter-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-border);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chapter-dot:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  transform: scale(1.3);
}

.chapter-dot.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 10px var(--vp-c-brand-1);
}

.dot-number {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chapter-dot:hover .dot-number,
.chapter-dot.active .dot-number {
  opacity: 1;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .back-to-top-btn {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
  }
  
  .reading-progress {
    bottom: 1rem;
    left: 1rem;
    width: 50px;
    height: 50px;
  }
  
  .progress-ring {
    width: 50px;
    height: 50px;
  }
  
  .progress-ring-bg,
  .progress-ring-progress {
    cx: 25;
    cy: 25;
    r: 22;
  }
  
  .progress-percentage {
    font-size: 0.6rem;
  }
  
  .chapter-navigator {
    display: none;
  }
}

/* 暗色主题适配 */
.dark .back-to-top-btn {
  background: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark .chapter-dot {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .scroll-progress,
  .back-to-top-btn,
  .chapter-dot,
  .progress-ring-progress {
    transition: none;
  }
  
  .back-to-top-btn:hover {
    transform: none;
  }
}
</style>

<style>
/* 全局滚动动画样式 */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-animate.animate {
  opacity: 1;
  transform: translateY(0);
}

/* 不同元素的动画延迟 */
.scroll-animate:nth-child(1) { transition-delay: 0.1s; }
.scroll-animate:nth-child(2) { transition-delay: 0.2s; }
.scroll-animate:nth-child(3) { transition-delay: 0.3s; }
.scroll-animate:nth-child(4) { transition-delay: 0.4s; }
.scroll-animate:nth-child(5) { transition-delay: 0.5s; }

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  
  .scroll-animate {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>