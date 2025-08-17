<template>
  <Layout>
    <!-- 在文档内容前添加文章元信息 -->
    <template #doc-before>
      <ArticleMeta v-if="isDocPage" />
    </template>
    
    <!-- 在文档内容后添加 Git 历史记录按钮 -->
    <template #doc-after>
      <div v-if="isDocPage" class="doc-footer-actions">
        <GitHistoryButton />
      </div>
    </template>
  </Layout>
  
  <!-- 全局模态框组件 -->
  <CodeBlockModal />
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ArticleMeta from './components/ArticleMeta.vue'
import GitHistoryButton from './components/GitHistoryButton.vue'
import CodeBlockModal from './components/CodeBlockModal.vue'

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
.doc-footer-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 640px) {
  .doc-footer-actions {
    justify-content: center;
  }
}
</style>