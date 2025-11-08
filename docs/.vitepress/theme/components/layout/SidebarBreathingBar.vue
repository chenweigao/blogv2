<template>
  <div 
    class="sidebar-dynamic-widget"
    :class="{ 
      'is-expanded': isExpanded,
      'is-interactive': isInteractive,
      [`theme-${currentTheme}`]: true,
      'has-particles': showParticles && enableAnimations
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
    :aria-expanded="isExpanded"
    :aria-label="title"
    role="button"
    tabindex="0"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- 主容器 -->
    <div class="widget-container">
      <!-- 动态背景层 -->
      <div class="background-layers">
        <div class="gradient-layer" :style="gradientStyle"></div>
        <div class="particle-layer">
          <div 
            v-for="particle in particles" 
            :key="particle.id"
            class="particle"
            :style="particle.style"
          ></div>
        </div>
        <div class="aurora-layer"></div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 紧凑模式内容 -->
        <div v-if="!isExpanded" class="compact-content">
          <div class="status-indicator">
            <div v-if="enableAnimations" class="pulse-ring"></div>
            <div class="status-dot" :class="`status-${status}`"></div>
          </div>
          <div class="compact-info">
            <span class="category-tag" v-if="category">{{ category }}</span>
            <span class="date-info" v-if="date">{{ formatDate(date) }}</span>
          </div>
          <div class="expand-hint">
            <svg class="expand-icon" viewBox="0 0 24 24">
              <path d="M7 14l5-5 5 5z"/>
            </svg>
          </div>
        </div>

        <!-- 展开模式内容 -->
        <Transition name="expand-content">
          <div v-if="isExpanded" class="expanded-content">
            <div class="header-section">
              <h4 class="widget-title">{{ title }}</h4>
              <button 
                class="close-btn" 
                @click.stop="collapse"
                aria-label="关闭"
                type="button"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ readingProgress }}%</div>
                <div class="stat-label">阅读进度</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ wordCount }}</div>
                <div class="stat-label">字数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ readingTime }}min</div>
                <div class="stat-label">阅读时间</div>
              </div>
            </div>

            <div class="action-buttons">
              <button 
                class="action-btn primary" 
                @click="scrollToTop"
                type="button"
                aria-label="回到顶部"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                </svg>
                回到顶部
              </button>
              <button 
                class="action-btn secondary" 
                @click="toggleTheme"
                type="button"
                aria-label="切换主题"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>
                </svg>
                {{ getThemeName(currentTheme) }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 自定义配置面板 -->
    <Transition name="config-panel">
      <div v-if="showConfig" class="config-panel">
        <h5>自定义设置</h5>
        <div class="config-options">
          <label class="config-item">
            <span>启用动画</span>
            <input type="checkbox" v-model="enableAnimations">
          </label>
          <label class="config-item">
            <span>显示粒子</span>
            <input type="checkbox" v-model="showParticles">
          </label>
          <label class="config-item">
            <span>主题色调</span>
            <select v-model="currentTheme">
              <option value="aurora">极光</option>
              <option value="ocean">海洋</option>
              <option value="sunset">日落</option>
              <option value="forest">森林</option>
            </select>
          </label>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, toRefs, nextTick } from 'vue'
import { defaultConfig, themeConfigs, utils, errorHandler } from './SidebarWidgetConfig.js'

// Props
const props = defineProps({
  category: { type: String, default: '' },
  date: { type: String, default: '' },
  title: { type: String, default: '文档信息' },
  enableInteraction: { type: Boolean, default: true },
  autoCollapse: { type: Boolean, default: true },
  collapseDelay: { type: Number, default: 3000 }
})

const { category, date, title, enableInteraction, autoCollapse, collapseDelay } = toRefs(props)

// 响应式状态
const isExpanded = ref(false)
const isInteractive = ref(true)
const showConfig = ref(false)
const currentTheme = ref('aurora')
const enableAnimations = ref(true)
const showParticles = ref(true)
const status = ref('active')

// 统计数据
const readingProgress = ref(0)
const wordCount = ref(0)
const readingTime = ref(0)

// 粒子系统
const particles = ref([])

// 定时器和状态
let collapseTimer = null
let scrollTimer = null
let isScrolling = false

// 性能监控
let performanceObserver = null

// 计算属性
const gradientStyle = computed(() => {
  const config = themeConfigs[currentTheme.value] || themeConfigs.aurora
  return { background: config.gradient }
})

// 方法
const handleMouseEnter = () => {
  if (!enableInteraction.value) return
  clearTimeout(collapseTimer)
  if (enableAnimations.value && showParticles.value) {
    generateParticles()
  }
}

const handleMouseLeave = () => {
  if (!enableInteraction.value) return
  if (autoCollapse.value && isExpanded.value) {
    collapseTimer = setTimeout(() => {
      isExpanded.value = false
    }, collapseDelay.value)
  }
}

const handleClick = () => {
  if (!enableInteraction.value) return
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    clearTimeout(collapseTimer)
    updateStats()
  }
}

const collapse = () => {
  isExpanded.value = false
}

const formatDate = (dateStr) => {
  return utils.formatDate(dateStr)
}

const generateParticles = () => {
  if (!showParticles.value || !enableAnimations.value) return
  
  errorHandler.safeExecute(() => {
    particles.value = utils.generateParticleStyles(defaultConfig.maxParticles)
  }, [])
}

const updateStats = () => {
  if (typeof window === 'undefined') return
  
  errorHandler.safeExecute(() => {
    const stats = utils.calculateReadingStats()
    readingProgress.value = stats.progress
    wordCount.value = stats.wordCount
    readingTime.value = stats.readingTime
  }, null)
}

const scrollToTop = () => {
  errorHandler.safeExecute(() => {
    utils.scrollToTop()
    collapse()
  }, null)
}


// 生命周期
onMounted(() => {
  updateStats()
  
  // 监听滚动事件更新阅读进度
  const handleScroll = utils.throttle(() => {
    if (isExpanded.value) {
      readingProgress.value = utils.calculateReadingProgress()
    }
  }, 100)
  
  window.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    clearTimeout(collapseTimer)
  })
})

const toggleTheme = () => {
  errorHandler.safeExecute(() => {
    const themes = Object.keys(themeConfigs)
    const currentIndex = themes.indexOf(currentTheme.value)
    currentTheme.value = themes[(currentIndex + 1) % themes.length]
  }, null)
}

const getThemeName = (theme) => {
  return errorHandler.safeExecute(() => {
    return themeConfigs[theme]?.name || '极光'
  }, '极光')
}

const onAnimationToggle = () => {
  errorHandler.safeExecute(() => {
    if (!enableAnimations.value) {
      showParticles.value = false
      particles.value = []
    }
  }, null)
}

// 节流的滚动处理
const throttledUpdateStats = utils.throttle(() => {
  updateStats()
}, 100)

// 生命周期
onMounted(() => {
  errorHandler.safeExecute(() => {
    nextTick(() => {
      // 检测用户偏好设置
      const preferences = utils.detectUserPreferences()
      if (preferences.prefersReducedMotion) {
        enableAnimations.value = false
        showParticles.value = false
      }
      
      // 初始化统计数据
      updateStats()
      
      // 添加滚动监听器
      if (typeof window !== 'undefined') {
        window.addEventListener('scroll', throttledUpdateStats, { passive: true })
        
        // 添加性能监控
        if ('PerformanceObserver' in window && defaultConfig.enablePerformanceMonitoring) {
          performanceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach(entry => {
              if (entry.entryType === 'measure' && entry.name.includes('sidebar-widget')) {
                console.log(`[SidebarWidget Performance] ${entry.name}: ${entry.duration}ms`)
              }
            })
          })
          performanceObserver.observe({ entryTypes: ['measure'] })
        }
      }
      
      // 生成初始粒子
      if (enableAnimations.value && showParticles.value) {
        generateParticles()
      }
    })
  }, null)
})

onUnmounted(() => {
  errorHandler.safeExecute(() => {
    // 清理事件监听器
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', throttledUpdateStats)
    }
    
    // 清理定时器
    if (collapseTimer) {
      clearTimeout(collapseTimer)
      collapseTimer = null
    }
    if (scrollTimer) {
      clearTimeout(scrollTimer)
      scrollTimer = null
    }
    
    // 清理性能监控
    if (performanceObserver) {
      performanceObserver.disconnect()
      performanceObserver = null
    }
    
    // 清理粒子
    particles.value = []
  }, null)
})

// 监听器
watch(enableAnimations, (newVal) => {
  errorHandler.safeExecute(() => {
    if (newVal && showParticles.value) {
      generateParticles()
    } else {
      particles.value = []
    }
  }, null)
})

watch(showParticles, (newVal) => {
  errorHandler.safeExecute(() => {
    if (newVal && enableAnimations.value) {
      generateParticles()
    } else {
      particles.value = []
    }
  }, null)
})

watch(currentTheme, (newTheme) => {
  errorHandler.safeExecute(() => {
    // 主题切换时重新生成粒子以匹配新主题
    if (enableAnimations.value && showParticles.value) {
      generateParticles()
    }
  }, null)
})
</script>

<style scoped>
.sidebar-dynamic-widget {
  position: relative;
  width: 100%;
  min-height: 60px;
  margin: 0;
  padding: 0;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px !important; /* 强制保持圆角 */
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* 确保所有浏览器都保持圆角 */
  -webkit-border-radius: 16px !important;
  -moz-border-radius: 16px !important;
  /* 防止子元素破坏圆角 */
  isolation: isolate;
}

.sidebar-dynamic-widget:hover .widget-container {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1);
  /* 悬停时强制保持圆角 */
  border-radius: 16px !important;
  -webkit-border-radius: 16px !important;
  -moz-border-radius: 16px !important;
}

/* 展开状态的圆角 */
.sidebar-dynamic-widget.is-expanded .widget-container {
  border-radius: 20px !important;
  -webkit-border-radius: 20px !important;
  -moz-border-radius: 20px !important;
}

.sidebar-dynamic-widget.is-expanded:hover .widget-container {
  border-radius: 20px !important;
  -webkit-border-radius: 20px !important;
  -moz-border-radius: 20px !important;
}

/* 防止全局样式干扰 - 重置可能影响边框的属性 */
.sidebar-dynamic-widget,
.sidebar-dynamic-widget *,
.sidebar-dynamic-widget *::before,
.sidebar-dynamic-widget *::after {
  box-sizing: border-box;
}

/* 确保根容器和所有子元素都保持圆角 */
.sidebar-dynamic-widget .widget-container,
.sidebar-dynamic-widget .background-layers,
.sidebar-dynamic-widget .gradient-layer,
.sidebar-dynamic-widget .particle-layer,
.sidebar-dynamic-widget .aurora-layer,
.sidebar-dynamic-widget .content-area {
  border-radius: inherit !important;
}

/* 背景层 */
.background-layers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  border-radius: inherit !important;
  overflow: hidden;
}

.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.particle-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.aurora-layer {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: aurora-flow 8s ease-in-out infinite alternate;
  pointer-events: none;
}

/* 内容区域 */
.content-area {
  position: relative;
  z-index: 2;
  padding: 12px 16px;
  color: var(--vp-c-text-1);
}

/* 紧凑模式 */
.compact-content {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 36px;
}

.status-indicator {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 50%;
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

.status-dot.status-active { background: #4ade80; }
.status-dot.status-warning { background: #fbbf24; }
.status-dot.status-error { background: #f87171; }

.compact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.category-tag {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-info {
  font-size: 11px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.expand-hint {
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.sidebar-dynamic-widget:hover .expand-hint {
  opacity: 1;
}

.expand-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  transition: transform 0.2s ease;
}

.is-expanded .expand-icon {
  transform: rotate(180deg);
}

/* 展开模式 */
.expanded-content {
  min-height: 200px;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.widget-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.close-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 2px;
}

.stat-label {
  font-size: 10px;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: var(--vp-c-brand-1);
  color: white;
}

.action-btn.primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.action-btn.secondary:hover {
  background: var(--vp-c-bg-elv);
  transform: translateY(-1px);
}

.action-btn svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

/* 配置面板 */
.config-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.config-panel h5 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.config-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.config-item input,
.config-item select {
  margin-left: 8px;
}

/* 动画 */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
}

@keyframes aurora-flow {
  0% { transform: rotate(0deg) scale(1); }
  100% { transform: rotate(360deg) scale(1.1); }
}

/* 过渡动画 */
.expand-content-enter-active,
.expand-content-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-content-enter-from,
.expand-content-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.config-panel-enter-active,
.config-panel-leave-active {
  transition: all 0.2s ease;
}

.config-panel-enter-from,
.config-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar-dynamic-widget {
    min-height: 50px;
  }
  
  .content-area {
    padding: 10px 12px;
  }
  
  .compact-content {
    gap: 8px;
    min-height: 30px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .compact-info {
    font-size: 11px;
  }
  
  .category-tag {
    font-size: 11px;
  }
  
  .date-info {
    font-size: 10px;
  }
}

/* 主题变体 */
.theme-aurora .gradient-layer {
  background: linear-gradient(135deg, rgba(10,37,64,0.4) 0%, rgba(255,212,0,0.3) 50%, rgba(0,208,132,0.4) 100%) !important;
}

.theme-ocean .gradient-layer {
  background: linear-gradient(135deg, rgba(0,119,190,0.4) 0%, rgba(0,180,216,0.3) 50%, rgba(144,224,239,0.4) 100%) !important;
}

.theme-sunset .gradient-layer {
  background: linear-gradient(135deg, rgba(255,94,77,0.4) 0%, rgba(255,154,0,0.3) 50%, rgba(255,206,84,0.4) 100%) !important;
}

.theme-forest .gradient-layer {
  background: linear-gradient(135deg, rgba(76,175,80,0.4) 0%, rgba(139,195,74,0.3) 50%, rgba(205,220,57,0.4) 100%) !important;
}

/* 无障碍和性能优化 */
@media (prefers-reduced-motion: reduce) {
  .sidebar-dynamic-widget,
  .sidebar-dynamic-widget *,
  .sidebar-dynamic-widget *::before,
  .sidebar-dynamic-widget *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .particle {
    display: none !important;
  }
  
  .aurora-layer {
    display: none !important;
  }
  
  .pulse-ring {
    animation: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .widget-container {
    border: 2px solid var(--vp-c-text-1);
  }
  
  .gradient-layer {
    opacity: 0.2;
  }
  
  .status-dot {
    border: 2px solid var(--vp-c-text-1);
  }
  
  .action-btn {
    border: 1px solid var(--vp-c-text-1);
  }
}

/* 打印样式 */
@media print {
  .sidebar-dynamic-widget {
    background: white !important;
    box-shadow: none !important;
    border: 1px solid #ccc !important;
  }
  
  .sidebar-dynamic-widget * {
    animation: none !important;
    transition: none !important;
  }
  
  .particle-layer,
  .aurora-layer {
    display: none !important;
  }
  
  .action-buttons {
    display: none !important;
  }
}

/* 焦点状态 */
.sidebar-dynamic-widget:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.widget-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--vp-border-radius-large);
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-1);
  transition: all var(--vp-animation-duration-normal) var(--vp-animation-easing-smooth);
  backdrop-filter: blur(8px);
}

.sidebar-dynamic-widget:hover .widget-container {
  transform: translateY(-1px);
  box-shadow: var(--vp-shadow-2);
  border-color: var(--vp-c-brand-soft);
}

/* 背景层优化 */
.background-layers {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.gradient-layer {
  position: absolute;
  inset: 0;
  opacity: 0.7;
  transition: opacity var(--vp-animation-duration-normal) ease;
  mix-blend-mode: multiply;
}

.particle-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
}

.aurora-layer {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 60%
  );
  animation: aurora-flow 12s ease-in-out infinite alternate;
  mix-blend-mode: overlay;
}

/* 内容区域 */
.content-area {
  position: relative;
  z-index: 2;
  padding: var(--vp-space-12) var(--vp-space-16);
  color: var(--vp-c-text-1);
}

/* 紧凑模式优化 */
.compact-content {
  display: flex;
  align-items: center;
  gap: var(--vp-space-12);
  min-height: 36px;
}

.status-indicator {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pulse-ring {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0.4;
  animation: pulse 2.5s ease-in-out infinite;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  position: relative;
  z-index: 1;
}

.status-dot.status-active { background: var(--vp-c-success); }
.status-dot.status-warning { background: var(--vp-c-warning); }
.status-dot.status-error { background: var(--vp-c-danger); }

.compact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.category-tag {
  font-size: var(--vp-font-size-xs);
  font-weight: 600;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: var(--vp-line-height-tight);
}

.date-info {
  font-size: calc(var(--vp-font-size-xs) * 0.9);
  color: var(--vp-c-text-3);
  white-space: nowrap;
  line-height: var(--vp-line-height-tight);
}

.expand-hint {
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity var(--vp-animation-duration-fast) ease;
  flex-shrink: 0;
}

.sidebar-dynamic-widget:hover .expand-hint {
  opacity: 1;
}

.expand-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  transition: transform var(--vp-animation-duration-normal) var(--vp-animation-easing-smooth);
}

.is-expanded .expand-icon {
  transform: rotate(180deg);
}

/* 展开模式优化 */
.expanded-content {
  min-height: 180px;
  animation: slideIn var(--vp-animation-duration-normal) var(--vp-animation-easing-smooth);
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--vp-space-16);
  padding-bottom: var(--vp-space-8);
  border-bottom: 1px solid var(--vp-c-divider-light);
}

.widget-title {
  margin: 0;
  font-size: var(--vp-font-size-s);
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: var(--vp-line-height-tight);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: var(--vp-border-radius-small);
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all var(--vp-animation-duration-fast) ease;
}

.close-btn:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  transform: scale(1.05);
}

.close-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--vp-space-8);
  margin-bottom: var(--vp-space-16);
}

.stat-item {
  text-align: center;
  padding: var(--vp-space-8);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--vp-border-radius-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--vp-animation-duration-fast) ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.stat-value {
  font-size: var(--vp-font-size-m);
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 2px;
  line-height: var(--vp-line-height-tight);
}

.stat-label {
  font-size: calc(var(--vp-font-size-xs) * 0.85);
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  line-height: var(--vp-line-height-tight);
}

.action-buttons {
  display: flex;
  gap: var(--vp-space-8);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--vp-space-8);
  padding: var(--vp-space-8) var(--vp-space-12);
  border: none;
  border-radius: var(--vp-border-radius-medium);
  font-size: var(--vp-font-size-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--vp-animation-duration-fast) ease;
  line-height: var(--vp-line-height-tight);
}

.action-btn.primary {
  background: var(--vp-c-brand-1);
  color: white;
}

.action-btn.primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: var(--vp-shadow-1);
}

.action-btn.secondary {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.action-btn.secondary:hover {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.action-btn svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  flex-shrink: 0;
}

/* 配置面板 */
.config-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--vp-border-radius-large);
  padding: var(--vp-space-16);
  margin-top: var(--vp-space-8);
  box-shadow: var(--vp-shadow-3);
  z-index: var(--vp-z-index-local);
  backdrop-filter: blur(12px);
}

.config-panel h5 {
  margin: 0 0 var(--vp-space-12) 0;
  font-size: var(--vp-font-size-s);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.config-options {
  display: flex;
  flex-direction: column;
  gap: var(--vp-space-8);
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--vp-font-size-xs);
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: var(--vp-space-4) 0;
}

.config-item input,
.config-item select {
  margin-left: var(--vp-space-8);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--vp-border-radius-small);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 2px 6px;
  font-size: var(--vp-font-size-xs);
}

/* 动画定义 */
@keyframes pulse {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.4; 
  }
  50% { 
    transform: scale(1.1); 
    opacity: 0.2; 
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.6; 
  }
  25% { 
    transform: translateY(-8px) rotate(90deg); 
    opacity: 1; 
  }
  50% { 
    transform: translateY(-4px) rotate(180deg); 
    opacity: 0.8; 
  }
  75% { 
    transform: translateY(-12px) rotate(270deg); 
    opacity: 0.9; 
  }
}

@keyframes aurora-flow {
  0% { 
    transform: rotate(0deg) scale(1); 
    opacity: 0.6; 
  }
  50% { 
    transform: rotate(180deg) scale(1.05); 
    opacity: 0.8; 
  }
  100% { 
    transform: rotate(360deg) scale(1); 
    opacity: 0.6; 
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 过渡动画 */
.expand-content-enter-active,
.expand-content-leave-active {
  transition: all var(--vp-animation-duration-normal) var(--vp-animation-easing-smooth);
}

.expand-content-enter-from,
.expand-content-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.config-panel-enter-active,
.config-panel-leave-active {
  transition: all var(--vp-animation-duration-fast) ease;
}

.config-panel-enter-from,
.config-panel-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar-dynamic-widget {
    min-height: 50px;
  }
  
  .content-area {
    padding: var(--vp-space-8) var(--vp-space-12);
  }
  
  .compact-content {
    gap: var(--vp-space-8);
    min-height: 32px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--vp-space-8);
  }
  
  .action-buttons {
    flex-direction: column;
    gap: var(--vp-space-8);
  }
  
  .expanded-content {
    min-height: 160px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--vp-space-8);
  }
  
  .compact-info {
    font-size: calc(var(--vp-font-size-xs) * 0.9);
  }
  
  .category-tag {
    font-size: calc(var(--vp-font-size-xs) * 0.9);
  }
  
  .date-info {
    font-size: calc(var(--vp-font-size-xs) * 0.8);
  }
}

/* 主题变体 */
.theme-ocean .gradient-layer {
  background: linear-gradient(135deg, rgba(0,119,190,0.4) 0%, rgba(0,180,216,0.3) 50%, rgba(144,224,239,0.4) 100%) !important;
}

.theme-sunset .gradient-layer {
  background: linear-gradient(135deg, rgba(255,94,77,0.4) 0%, rgba(255,154,0,0.3) 50%, rgba(255,206,84,0.4) 100%) !important;
}

.theme-forest .gradient-layer {
  background: linear-gradient(135deg, rgba(76,175,80,0.4) 0%, rgba(139,195,74,0.3) 50%, rgba(205,220,57,0.4) 100%) !important;
}

/* 无障碍和性能优化 */
@media (prefers-reduced-motion: reduce) {
  .sidebar-dynamic-widget,
  .sidebar-dynamic-widget *,
  .sidebar-dynamic-widget *::before,
  .sidebar-dynamic-widget *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .particle {
    display: none !important;
  }
  
  .aurora-layer {
    display: none !important;
  }
  
  .pulse-ring {
    animation: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .widget-container {
    border: 2px solid var(--vp-c-text-1);
  }
  
  .gradient-layer {
    opacity: 0.2;
  }
  
  .status-dot {
    border: 2px solid var(--vp-c-text-1);
  }
  
  .action-btn {
    border: 1px solid var(--vp-c-text-1);
  }
}

/* 打印样式 */
@media print {
  .sidebar-dynamic-widget {
    background: white !important;
    box-shadow: none !important;
    border: 1px solid #ccc !important;
  }
  
  .sidebar-dynamic-widget * {
    animation: none !important;
    transition: none !important;
  }
  
  .particle-layer,
  .aurora-layer {
    display: none !important;
  }
  
  .action-buttons {
    display: none !important;
  }
}

/* 无障碍和性能优化 */
@media (prefers-reduced-motion: reduce) {
  .sidebar-dynamic-widget,
  .widget-container,
  .particle,
  .aurora-layer,
  .pulse-ring,
  .expand-icon,
  .action-btn {
    animation: none !important;
    transition: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .widget-container {
    border: 2px solid var(--vp-c-text-1);
  }
  
  .gradient-layer {
    opacity: 0.3;
  }
}

/* ===== 最终保护规则 - 确保边框圆角永不变形 ===== */

/* 强制所有状态下保持圆角 - 最高优先级 */
.sidebar-dynamic-widget .widget-container {
  border-radius: 16px !important;
  -webkit-border-radius: 16px !important;
  -moz-border-radius: 16px !important;
  overflow: hidden !important;
}

.sidebar-dynamic-widget:hover .widget-container,
.sidebar-dynamic-widget:focus .widget-container,
.sidebar-dynamic-widget:active .widget-container {
  border-radius: 16px !important;
  -webkit-border-radius: 16px !important;
  -moz-border-radius: 16px !important;
  overflow: hidden !important;
}

.sidebar-dynamic-widget.is-expanded .widget-container {
  border-radius: 20px !important;
  -webkit-border-radius: 20px !important;
  -moz-border-radius: 20px !important;
  overflow: hidden !important;
}

.sidebar-dynamic-widget.is-expanded:hover .widget-container,
.sidebar-dynamic-widget.is-expanded:focus .widget-container,
.sidebar-dynamic-widget.is-expanded:active .widget-container {
  border-radius: 20px !important;
  -webkit-border-radius: 20px !important;
  -moz-border-radius: 20px !important;
  overflow: hidden !important;
}

/* 防止任何全局样式覆盖 */
.sidebar-dynamic-widget {
  /* 重置任何可能影响边框的全局样式 */
  border-radius: initial !important;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  /* 确保组件独立性 */
  contain: layout style paint;
  isolation: isolate;
}

/* 确保所有子元素都不会破坏圆角 */
.sidebar-dynamic-widget .widget-container > *,
.sidebar-dynamic-widget .widget-container::before,
.sidebar-dynamic-widget .widget-container::after {
  border-radius: inherit !important;
}

/* 确保在任何浏览器和设备上都保持圆角 */
@supports (border-radius: 16px) {
  .sidebar-dynamic-widget .widget-container {
    border-radius: 16px !important;
  }
  
  .sidebar-dynamic-widget.is-expanded .widget-container {
    border-radius: 20px !important;
  }
}

/* 兼容旧版浏览器 */
@supports not (border-radius: 16px) {
  .sidebar-dynamic-widget .widget-container {
    -webkit-border-radius: 16px !important;
    -moz-border-radius: 16px !important;
  }
  
  .sidebar-dynamic-widget.is-expanded .widget-container {
    -webkit-border-radius: 20px !important;
    -moz-border-radius: 20px !important;
  }
}
</style>