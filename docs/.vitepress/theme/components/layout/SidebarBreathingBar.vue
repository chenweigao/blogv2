<template>
  <div 
    class="sidebar-dynamic-widget"
    :class="{ 
      'is-expanded': isExpanded,
      'is-interactive': isInteractive,
      [`theme-${currentTheme}`]: true
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
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
            <div class="pulse-ring"></div>
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
              <button class="close-btn" @click.stop="collapse">
                <svg viewBox="0 0 24 24">
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
              <button class="action-btn primary" @click="scrollToTop">
                <svg viewBox="0 0 24 24">
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                </svg>
                回到顶部
              </button>
              <button class="action-btn secondary" @click="toggleTheme">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                切换主题
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
import { ref, computed, onMounted, onUnmounted, watch, toRefs } from 'vue'

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

// 统计数据（模拟）
const readingProgress = ref(0)
const wordCount = ref(1250)
const readingTime = ref(5)

// 粒子系统
const particles = ref([])
const maxParticles = 8

// 定时器
let collapseTimer = null
let animationFrame = null

// 计算属性
const gradientStyle = computed(() => {
  const themes = {
    aurora: 'linear-gradient(135deg, rgba(10,37,64,0.4) 0%, rgba(255,212,0,0.3) 50%, rgba(0,208,132,0.4) 100%)',
    ocean: 'linear-gradient(135deg, rgba(0,119,190,0.4) 0%, rgba(0,180,216,0.3) 50%, rgba(144,224,239,0.4) 100%)',
    sunset: 'linear-gradient(135deg, rgba(255,94,77,0.4) 0%, rgba(255,154,0,0.3) 50%, rgba(255,206,84,0.4) 100%)',
    forest: 'linear-gradient(135deg, rgba(76,175,80,0.4) 0%, rgba(139,195,74,0.3) 50%, rgba(205,220,57,0.4) 100%)'
  }
  return { background: themes[currentTheme.value] || themes.aurora }
})

// 方法
const handleMouseEnter = () => {
  if (!enableInteraction.value) return
  clearTimeout(collapseTimer)
  if (enableAnimations.value) {
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
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const generateParticles = () => {
  if (!showParticles.value || !enableAnimations.value) return
  
  particles.value = []
  for (let i = 0; i < maxParticles; i++) {
    particles.value.push({
      id: i,
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: (Math.random() * 3 + 2) + 's'
      }
    })
  }
}

const updateStats = () => {
  // 模拟获取阅读统计
  const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
  readingProgress.value = Math.max(0, Math.min(100, scrollPercent))
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  collapse()
}

const toggleTheme = () => {
  const themes = ['aurora', 'ocean', 'sunset', 'forest']
  const currentIndex = themes.indexOf(currentTheme.value)
  currentTheme.value = themes[(currentIndex + 1) % themes.length]
}

// 生命周期
onMounted(() => {
  updateStats()
  window.addEventListener('scroll', updateStats)
  
  if (enableAnimations.value) {
    generateParticles()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateStats)
  clearTimeout(collapseTimer)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

// 监听动画设置变化
watch(enableAnimations, (newVal) => {
  if (newVal) {
    generateParticles()
  } else {
    particles.value = []
  }
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
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-dynamic-widget:hover .widget-container {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 背景层 */
.background-layers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
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
</style>