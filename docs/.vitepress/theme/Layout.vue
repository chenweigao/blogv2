<template>
  <Layout>
    <!-- 在文档内容前添加文章元信息和历史记录的组合布局 -->
    <template #doc-before>
      <div v-if="isDocPage" class="doc-header-container">
        <!-- 文章元信息（标题、日期、分类、作者、标签） -->
        <div class="meta-section">
          <ArticleMeta :show-reading-stats="false" />
        </div>
        
        <!-- 阅读统计和历史记录同行 -->
        <div class="stats-history-row">
          <!-- 左侧：阅读统计 -->
          <div class="reading-stats-section">
            <ReadingStats />
          </div>
          
          <!-- 右侧：历史记录按钮 -->
          <div class="history-section">
            <GitHistoryButton />
          </div>
        </div>
      </div>
    </template>
  </Layout>
  
  <!-- 增强版 TOC 组件 - 在所有页面中显示 -->
  <EnhancedTOC v-if="isDocPage" />
  
  <!-- 全局模态框组件 -->
  <CodeBlockModal />
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ArticleMeta from './components/ArticleMeta.vue'
import ReadingStats from './components/ReadingStats.vue'
import GitHistoryButton from './components/GitHistoryButton.vue'
import CodeBlockModal from './components/CodeBlockModal.vue'
import EnhancedTOC from './components/EnhancedTOC.vue'

const Layout = DefaultTheme.Layout
const { page } = useData()

// 判断是否为文档页面（非首页、非特殊页面）
const isDocPage = computed(() => {
  if (!page.value) return false
  
  // 排除首页和特殊页面
  const excludePages = ['/', '/index', '/home', '/timeline', '/search', '/about']
  const currentPath = page.value.relativePath?.replace(/\.md$/, '') || ''
  const normalizedPath = '/' + currentPath
  
  // 如果是排除的页面，不显示
  if (excludePages.includes(normalizedPath) || excludePages.includes('/' + currentPath)) {
    return false
  }
  
  // 如果页面有 frontmatter 且明确设置了 layout，根据 layout 判断
  const frontmatter = page.value.frontmatter || {}
  if (frontmatter.layout === 'home' || frontmatter.layout === 'page') {
    return false
  }
  
  // 默认情况下，有内容的 markdown 文件都视为文档页面
  return true
})
</script>

<style scoped>
.doc-header-container {
  margin-bottom: 2rem;
}

.meta-section {
  margin-bottom: 1.5rem;
}

.stats-history-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  gap: 2rem;
}

.reading-stats-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.history-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-history-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .reading-stats-section {
    width: 100%;
  }
  
  .history-section {
    align-self: flex-end;
  }
}

@media (max-width: 640px) {
  .stats-history-row {
    gap: 0.75rem;
  }
  
  .history-section {
    align-self: center;
  }
}
</style>