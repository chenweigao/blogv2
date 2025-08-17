<template>
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
</template>

<script setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const showStats = ref(true)

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
  
  if (!content) return 0
  
  // 分别统计中文字符和英文单词
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  const numbers = (content.match(/\d+/g) || []).join('').length
  
  // 中文按字符计算，英文按单词计算，数字按字符计算
  const totalCount = chineseChars + englishWords + Math.ceil(numbers / 3)
  
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
</script>

<style scoped>
.reading-stats {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
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

.stat-text {
  font-weight: 500;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .reading-stats {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .stat-item {
    font-size: 0.8rem;
  }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .stat-icon {
    animation: none;
  }
}
</style>