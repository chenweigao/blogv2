<template>
  <div class="timeline-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载时间线数据...</p>
    </div>

    <!-- 主要内容 -->
    <div v-else>
      <div class="timeline-header">
        <h1 class="timeline-title">
          <span class="title-icon">📚</span>
          <span class="title-text">Knowledge Timeline</span>
          <div class="title-glow"></div>
        </h1>
        <p class="timeline-description">按时间顺序浏览所有文章和学习笔记</p>
        
        <!-- 分类筛选 -->
        <div class="category-filter">
          <button 
            v-for="category in categories" 
            :key="category"
            :class="['category-btn', { active: selectedCategory === category }]"
            @click="selectedCategory = category"
            @mouseenter="onCategoryHover(category)"
            @mouseleave="onCategoryLeave(category)"
          >
            <span class="btn-icon">{{ getCategoryIcon(category) }}</span>
            <span class="btn-text">{{ getCategoryName(category) }}</span>
            <div class="btn-ripple"></div>
          </button>
        </div>
        
        <!-- 统计信息 -->
        <div class="timeline-stats">
          <div class="stat-card" v-for="(stat, index) in timelineStats" :key="stat.label" :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-content">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="filteredItems.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>暂无文章</h3>
        <p>当前分类 "{{ getCategoryName(selectedCategory) }}" 下暂无文章</p>
        <button @click="selectedCategory = 'all'" class="reset-filter-btn">查看所有文章</button>
      </div>

      <!-- 时间线内容 -->
      <div v-else class="timeline" ref="timelineRef">
        <!-- 时间线主轴 -->
        <div class="timeline-axis">
          <div class="axis-progress" :style="{ height: `${scrollProgress}%` }"></div>
        </div>
        
        <div 
          v-for="(item, index) in filteredItems" 
          :key="item.path"
          class="timeline-item"
          :class="{ 
            'timeline-item-left': index % 2 === 0, 
            'timeline-item-right': index % 2 === 1,
            'in-view': item.inView
          }"
          :ref="el => setItemRef(el, index)"
          @mouseenter="onItemHover(item, index)"
          @mouseleave="onItemLeave(item, index)"
        >
          <div class="timeline-marker">
            <div class="timeline-dot" :style="{ backgroundColor: getCategoryColor(item.category) }">
              <div class="dot-pulse"></div>
              <div class="dot-icon">{{ getCategoryIcon(item.category) }}</div>
            </div>
            <div class="marker-line"></div>
          </div>
          
          <div class="timeline-content">
            <div class="timeline-card" :class="item.category">
              <div class="card-header">
                <h3 class="article-title">
                  <a :href="item.path" class="article-link">{{ item.title }}</a>
                </h3>
                <div class="article-meta">
                  <span class="category-tag" :style="{ backgroundColor: getCategoryColor(item.category) }">
                    {{ getCategoryIcon(item.category) }} {{ getCategoryName(item.category) }}
                  </span>
                  <span class="date">
                    {{ item.displayDate || formatDate(item.createTime) }}
                  </span>
                </div>
              </div>
              
              <p class="article-description">{{ item.description }}</p>
              
              <div class="card-footer">
                <div class="tags" v-if="item.tags && item.tags.length > 0">
                  <span v-for="(tag, tagIndex) in item.tags" :key="tag" class="tag" :style="{ animationDelay: `${tagIndex * 0.05}s` }">
                    {{ tag }}
                  </span>
                </div>
                <span class="read-more">
                  <a :href="item.path" class="read-more-link">
                    <span>阅读更多</span>
                    <svg class="read-more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </span>
              </div>
              
              <!-- 卡片装饰 -->
              <div class="card-decorations">
                <div class="decoration-corner"></div>
                <div class="decoration-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="timeline-footer">
        <div class="footer-stats">
          <div class="total-articles">
            <span class="stats-icon">📊</span>
            <span>共 {{ filteredItems.length }} 篇文章</span>
          </div>
          <div class="reading-time">
            <span class="stats-icon">⏱️</span>
            <span>预计阅读 {{ totalReadingTime }} 分钟</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { data as timelineData } from '../data/timeline.data.js'

const selectedCategory = ref('all')
const items = ref([])
const timelineRef = ref(null)
const itemRefs = ref([])
const scrollProgress = ref(0)
const isLoading = ref(true)

// 动态加载时间线数据
onMounted(async () => {
  try {
    // 使用 VitePress 数据加载器的数据
    items.value = timelineData || []
    console.log('Timeline data loaded:', items.value.length, 'articles')
    console.log('Sample item with tags:', items.value.find(item => item.tags?.length > 0))
  } catch (error) {
    console.error('Failed to load timeline data:', error)
    items.value = []
  } finally {
    isLoading.value = false
  }
  
  await nextTick()
  
  // 初始化动画
  setTimeout(() => {
    const header = document.querySelector('.timeline-header')
    if (header) {
      header.classList.add('loaded')
    }
  }, 100)
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // 初始检查
})

// 获取所有分类
const categories = computed(() => {
  const cats = ['all', ...new Set(items.value.map(item => item.category))]
  return cats
})

// 筛选后的文章
const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return items.value
  }
  return items.value.filter(item => item.category === selectedCategory.value)
})

// 时间线统计
const timelineStats = computed(() => {
  const stats = [
    { icon: '📝', label: '总文章', value: items.value.length },
    { icon: '📚', label: '分类', value: categories.value.length - 1 },
    { icon: '🏷️', label: '标签', value: new Set(items.value.flatMap(item => item.tags || [])).size },
    { icon: '📅', label: '最新', value: '今天' }
  ]
  return stats
})

// 总阅读时间
const totalReadingTime = computed(() => {
  return Math.ceil(filteredItems.value.length * 3) // 假设每篇文章3分钟
})

// 分类配置
const categoryConfig = {
  ai: { name: 'AI & ML', icon: '🤖', color: '#ff6b6b' },
  cpu: { name: 'CPU 架构', icon: '🔧', color: '#4ecdc4' },
  java: { name: 'Java', icon: '☕', color: '#45b7d1' },
  algorithm: { name: '算法', icon: '📊', color: '#96ceb4' },
  python: { name: 'Python', icon: '🐍', color: '#feca57' },
  general: { name: '通用', icon: '📝', color: '#a29bfe' },
  test: { name: '测试', icon: '🧪', color: '#fd79a8' }
}

function getCategoryName(category) {
  return categoryConfig[category]?.name || category
}

function getCategoryIcon(category) {
  return categoryConfig[category]?.icon || '📝'
}

function getCategoryColor(category) {
  return categoryConfig[category]?.color || '#a29bfe'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 设置元素引用
function setItemRef(el, index) {
  if (el) {
    itemRefs.value[index] = el
  }
}

// 滚动处理
function handleScroll() {
  if (!timelineRef.value) return
  
  const scrollTop = window.pageYOffset
  const timelineTop = timelineRef.value.offsetTop
  const timelineHeight = timelineRef.value.offsetHeight
  const windowHeight = window.innerHeight
  
  // 更新滚动进度
  const progress = Math.min(Math.max((scrollTop - timelineTop + windowHeight) / timelineHeight, 0), 1)
  scrollProgress.value = progress * 100
  
  // 检查元素是否在视口中
  itemRefs.value.forEach((el, index) => {
    if (el) {
      const rect = el.getBoundingClientRect()
      const inView = rect.top < windowHeight && rect.bottom > 0
      
      if (inView && !filteredItems.value[index].inView) {
        filteredItems.value[index].inView = true
        el.classList.add('animate-in')
      }
    }
  })
}

// 分类悬停事件
function onCategoryHover(category) {
  // 可以添加预览效果
}

function onCategoryLeave(category) {
  // 清除预览效果
}

// 文章项悬停事件
function onItemHover(item, index) {
  const el = itemRefs.value[index]
  if (el) {
    el.classList.add('hovered')
  }
}

function onItemLeave(item, index) {
  const el = itemRefs.value[index]
  if (el) {
    el.classList.remove('hovered')
  }
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

/* 增强的头部样式 */
.timeline-header {
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  animation: headerFadeIn 1s ease-out 0.2s forwards;
}

.timeline-header.loaded {
  opacity: 1;
  transform: translateY(0);
}

@keyframes headerFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.title-icon {
  display: inline-block;
  margin-right: 0.5rem;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.title-text {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.title-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  filter: blur(20px);
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.3;
  }
}

.timeline-description {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
  animation: descriptionSlide 0.8s ease-out 0.4s forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes descriptionSlide {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 增强的分类筛选 */
.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: btnFadeIn 0.6s ease-out forwards;
  opacity: 0;
  transform: scale(0.9);
}

.category-btn:nth-child(1) { animation-delay: 0.6s; }
.category-btn:nth-child(2) { animation-delay: 0.7s; }
.category-btn:nth-child(3) { animation-delay: 0.8s; }
.category-btn:nth-child(4) { animation-delay: 0.9s; }
.category-btn:nth-child(5) { animation-delay: 1.0s; }
.category-btn:nth-child(6) { animation-delay: 1.1s; }

@keyframes btnFadeIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.category-btn:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.category-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.category-btn:hover .btn-icon {
  transform: scale(1.2) rotate(10deg);
}

.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.category-btn:hover .btn-ripple {
  width: 200px;
  height: 200px;
}

/* 统计卡片 */
.timeline-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 120px;
  transition: all 0.3s ease;
  animation: statCardSlide 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes statCardSlide {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand-1);
}

.stat-icon {
  font-size: 1.5rem;
  animation: statIconPulse 2s ease-in-out infinite;
}

@keyframes statIconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.stat-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

/* 增强的时间线 */
.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline-axis {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--vp-c-border);
  transform: translateX(-50%);
  border-radius: 2px;
}

.axis-progress {
  width: 100%;
  background: linear-gradient(to bottom, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 2px;
  transition: height 0.1s ease;
  position: relative;
}

.axis-progress::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  width: 12px;
  height: 12px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px var(--vp-c-brand-1);
}

/* 增强的时间线项目 */
.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  width: 50%;
  opacity: 1; /* 修复：默认可见 */
  transform: translateY(0); /* 修复：默认位置正常 */
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.timeline-item-left {
  left: 0;
  padding-right: 3rem;
}

.timeline-item-right {
  left: 50%;
  padding-left: 3rem;
}

.timeline-item.hovered {
  transform: translateY(-5px) scale(1.02);
}

/* 增强的时间线标记 */
.timeline-marker {
  position: absolute;
  top: 1rem;
  width: 40px;
  height: 40px;
  z-index: 10;
}

.timeline-item-left .timeline-marker {
  right: -20px;
}

.timeline-item-right .timeline-marker {
  left: -20px;
}

.timeline-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--vp-c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px var(--vp-c-border), 0 0 20px rgba(0, 0, 0, 0.2);
}

.dot-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: inherit;
  opacity: 0.6;
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
}

.dot-icon {
  font-size: 1.2rem;
  z-index: 2;
}

/* 增强的时间线卡片 */
.timeline-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.timeline-item:hover .timeline-card {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border-color: var(--vp-c-brand-1);
}

.card-header {
  margin-bottom: 1rem;
}

.article-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.article-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.article-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--vp-c-brand-1);
  transition: width 0.3s ease;
}

.article-link:hover::after {
  width: 100%;
}

.article-link:hover {
  color: var(--vp-c-brand-1);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
}

.category-tag:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.date {
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

.article-description {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s ease;
  animation: tagSlideIn 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(-10px);
}

@keyframes tagSlideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tag:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: --vp-c-brand-1);
  transform: translateY(-2px);
}

.read-more-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.read-more-link:hover {
  transform: translateX(5px);
}

.read-more-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.read-more-link:hover .read-more-icon {
  transform: translateX(3px);
}

/* 卡片装饰 */
.card-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-top: 20px solid var(--vp-c-brand-soft);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-item:hover .decoration-corner {
  opacity: 1;
}

.decoration-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 18px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.timeline-item:hover .decoration-glow {
  opacity: 0.1;
}

/* 底部统计 */
.timeline-footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-border);
}

.footer-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.total-articles,
.reading-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.stats-icon {
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-container {
    padding: 1rem;
  }
  
  .timeline-title {
    font-size: 2rem;
  }
  
  .timeline-description {
    font-size: 1rem;
  }
  
  .timeline-stats {
    gap: 0.5rem;
  }
  
  .stat-card {
    min-width: 100px;
    padding: 0.75rem;
  }
  
  .timeline::before {
    left: 2rem;
  }
  
  .timeline-item {
    width: 100%;
    left: 0 !important;
    padding-left: 4rem !important;
    padding-right: 0 !important;
  }
  
  .timeline-marker {
    left: 1rem !important;
    right: auto !important;
  }
  
  .timeline-dot {
    width: 30px;
    height: 30px;
  }
  
  .dot-icon {
    font-size: 1rem;
  }
  
  .footer-stats {
    flex-direction: column;
    gap: 1rem;
  }
}

/* 暗色主题适配 */
.dark .timeline-card {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

.dark .stat-card {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

.dark .category-btn {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .timeline-item,
  .category-btn,
  .stat-card,
  .timeline-description {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .title-icon,
  .stat-icon,
  .dot-pulse {
    animation: none;
  }
  
  .timeline-item:hover {
    transform: none;
  }
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--vp-c-border);
  border-top: 4px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: var(--vp-c-text-2);
}

.reset-filter-btn {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.reset-filter-btn:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
}
</style>