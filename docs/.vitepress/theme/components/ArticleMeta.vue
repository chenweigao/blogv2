<template>
  <div class="article-meta" v-if="showMeta">
    <div class="meta-container">
      <!-- 文章标题 -->
      <h1 class="article-title" v-if="frontmatter.title">
        <span class="title-text">{{ frontmatter.title }}</span>
        <div class="title-decoration"></div>
      </h1>
      
      <!-- 元数据信息 -->
      <div class="meta-info">
        <!-- 发布日期 -->
        <div class="meta-item date" v-if="frontmatter.date">
          <div class="meta-icon-wrapper">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span class="meta-text">{{ formattedDate }}</span>
        </div>
        
        <!-- 分类信息 -->
        <div class="meta-item categories" v-if="frontmatter.category && frontmatter.category.length">
          <div class="meta-icon-wrapper">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="category-tags">
            <span 
              class="category-tag" 
              v-for="(cat, index) in frontmatter.category" 
              :key="cat"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              {{ cat }}
              <div class="tag-ripple"></div>
            </span>
          </div>
        </div>
        
        <!-- 作者信息 -->
        <div class="meta-item author" v-if="frontmatter.author">
          <div class="meta-icon-wrapper">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span class="meta-text">{{ frontmatter.author }}</span>
        </div>
        
        <!-- 标签信息 -->
        <div class="meta-item tags" v-if="frontmatter.tags && frontmatter.tags.length">
          <div class="meta-icon-wrapper">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </div>
          <div class="tag-list">
            <span 
              class="tag" 
              v-for="(tag, index) in frontmatter.tags" 
              :key="tag"
              :style="{ animationDelay: `${index * 0.05}s` }"
              @click="onTagClick(tag)"
            >
              #{{ tag }}
              <div class="tag-glow"></div>
            </span>
          </div>
        </div>
      </div>
      
      <!-- 阅读统计 -->
      <div class="reading-stats" v-if="showStats">
        <div class="stat-item">
          <div class="stat-icon">📖</div>
          <span class="stat-text">{{ estimatedReadTime }} 分钟阅读</span>
        </div>
        <div class="stat-item">
          <div class="stat-icon">📝</div>
          <span class="stat-text">{{ wordCount }} 字</span>
        </div>
      </div>
    </div>
    
    <!-- 装饰性元素 -->
    <div class="meta-decorations">
      <div class="decoration-particle" v-for="n in 5" :key="n" :style="getParticleStyle(n)"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const showStats = ref(true)

// 检查是否显示元数据
const showMeta = computed(() => {
  return frontmatter.value.title || 
         frontmatter.value.date || 
         frontmatter.value.category || 
         frontmatter.value.author || 
         frontmatter.value.tags
})

// 格式化日期
const formattedDate = computed(() => {
  if (!frontmatter.value.date) return ''
  
  const date = new Date(frontmatter.value.date)
  if (isNaN(date.getTime())) return frontmatter.value.date
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// 计算字数
const wordCount = computed(() => {
  if (!page.value.content) {
    // 在开发模式下，使用可用的信息来估算字数
    let estimatedWords = 0
    
    // 基于标题估算
    if (frontmatter.value.title) {
      estimatedWords += frontmatter.value.title.length
    }
    
    // 基于描述估算
    if (frontmatter.value.description) {
      estimatedWords += frontmatter.value.description.length
    }
    
    // 基于文件路径深度估算内容复杂度
    const pathDepth = page.value.filePath ? page.value.filePath.split('/').length : 1
    const baseEstimate = Math.max(500, pathDepth * 200) // 基础估算
    
    estimatedWords += baseEstimate
    
    return estimatedWords
  }
  
  let content = page.value.content
  
  // 移除 markdown 语法标记
  content = content
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码
    .replace(/`[^`]*`/g, '')
    // 移除链接
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除图片
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除列表标记
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 移除引用标记
    .replace(/^>\s+/gm, '')
    // 移除粗体和斜体标记
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // 移除删除线
    .replace(/~~([^~]+)~~/g, '$1')
    // 移除HTML标签
    .replace(/<[^>]*>/g, '')
    // 移除多余的空白字符
    .replace(/\s+/g, ' ')
    .trim()
  
  console.log('Debug - cleaned content length:', content.length)
  console.log('Debug - cleaned content preview:', content.substring(0, 200))
  
  if (!content) return 0
  
  // 分别统计中文字符和英文单词
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  const numbers = (content.match(/\d+/g) || []).join('').length
  
  console.log('Debug - chineseChars:', chineseChars)
  console.log('Debug - englishWords:', englishWords)
  console.log('Debug - numbers:', numbers)
  
  // 中文按字符计算，英文按单词计算，数字按字符计算
  const totalCount = chineseChars + englishWords + Math.ceil(numbers / 3)
  console.log('Debug - totalCount:', totalCount)
  
  return totalCount
})

// 估算阅读时间
const estimatedReadTime = computed(() => {
  if (wordCount.value === 0) return 1
  
  // 中文阅读速度约 300-500 字/分钟，英文约 200-250 词/分钟
  // 这里使用一个综合的阅读速度
  const wordsPerMinute = 350
  const minutes = Math.ceil(wordCount.value / wordsPerMinute)
  
  return Math.max(minutes, 1) // 最少显示1分钟
})

// 标签点击事件
function onTagClick(tag) {
  // 可以添加标签搜索功能
  console.log('Tag clicked:', tag)
}

// 生成装饰粒子样式
function getParticleStyle(index) {
  const delay = Math.random() * 2
  const duration = 3 + Math.random() * 2
  const size = 2 + Math.random() * 3
  const left = Math.random() * 100
  const top = Math.random() * 100
  
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}

onMounted(() => {
  // 添加入场动画
  setTimeout(() => {
    const metaElement = document.querySelector('.article-meta')
    if (metaElement) {
      metaElement.classList.add('meta-loaded')
    }
  }, 100)
})
</script>

<style scoped>
.article-meta {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  animation: metaFadeIn 0.8s ease-out 0.2s forwards;
}

@keyframes metaFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.meta-container {
  max-width: 100%;
  position: relative;
  z-index: 2;
}

/* 增强的标题样式 */
.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  position: relative;
  overflow: hidden;
}

.title-text {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  animation: titleGlow 2s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% {
    filter: brightness(1);
  }
  100% {
    filter: brightness(1.2);
  }
}

.title-decoration {
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  animation: titleUnderline 1s ease-out 0.5s forwards;
}

@keyframes titleUnderline {
  to {
    width: 100%;
  }
}

/* 增强的元数据信息 */
.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  animation: metaItemSlide 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

.meta-item:nth-child(1) { animation-delay: 0.3s; }
.meta-item:nth-child(2) { animation-delay: 0.4s; }
.meta-item:nth-child(3) { animation-delay: 0.5s; }
.meta-item:nth-child(4) { animation-delay: 0.6s; }

@keyframes metaItemSlide {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.meta-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.meta-icon-wrapper:hover {
  background: var(--vp-c-brand-soft);
  transform: scale(1.1) rotate(5deg);
}

.meta-icon {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.meta-icon-wrapper:hover .meta-icon {
  color: var(--vp-c-brand-1);
}

.meta-text {
  transition: all 0.3s ease;
}

.meta-item:hover .meta-text {
  color: var(--vp-c-brand-1);
  transform: translateX(2px);
}

/* 增强的分类和标签 */
.category-tags,
.tag-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-tag {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--vp-c-brand-1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  animation: tagBounce 0.6s ease-out forwards;
  opacity: 0;
  transform: scale(0.8);
}

@keyframes tagBounce {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.category-tag:hover {
  background-color: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tag-ripple {
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

.category-tag:hover .tag-ripple {
  width: 100px;
  height: 100px;
}

.tag {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: 0.2rem 0.6rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--vp-c-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  animation: tagFloat 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes tagFloat {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tag:hover {
  background-color: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand-1);
  color: --vp-c-brand-1);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.tag-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.tag:hover .tag-glow {
  left: 100%;
}

/* 阅读统计 */
.reading-stats {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  animation: statsSlide 0.8s ease-out 0.7s forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes statsSlide {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  transition: all 0.3s ease;
}

.stat-item:hover {
  color: var(--vp-c-brand-1);
  transform: scale(1.05);
}

.stat-icon {
  font-size: 1rem;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 装饰性元素 */
.meta-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-particle {
  position: absolute;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0.1;
  animation: particleFloat 5s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.3;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-title {
    font-size: 2rem;
  }
  
  .meta-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .meta-item {
    width: 100%;
  }
  
  .category-tags,
  .tag-list {
    width: 100%;
  }
  
  .reading-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* 暗色主题适配 */
.dark .category-tag {
  background-color: rgba(var(--vp-c-brand-1), 0.2);
  border-color: var(--vp-c-brand-1);
}

.dark .tag {
  background-color: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

.dark .meta-icon-wrapper {
  background: var(--vp-c-bg-alt);
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .article-meta,
  .meta-item,
  .category-tag,
  .tag,
  .reading-stats {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .title-text {
    animation: none;
  }
  
  .stat-icon {
    animation: none;
  }
  
  .decoration-particle {
    animation: none;
  }
}
</style>