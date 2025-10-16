<template>
  <Layout>
    <!-- 全局顶部内容 -->
    <template #layout-top>
      <a href="#main-content" class="skip-to-content visually-hidden-focusable">跳转到正文</a>
      <LayoutEnhancementIndicator />
    </template>

    <!-- 导航栏标题后的内容 -->
    <template #nav-bar-title-after>
      <div :class="$style.navEnhancement">
        <!-- 可以在这里添加导航增强功能 -->
      </div>
    </template>

    <!-- 导航栏增强组件 -->
    <template #nav-screen-content-after>
      <NavbarEnhancer />
    </template>

    <!-- 侧边栏导航前的内容 -->
    <template #sidebar-nav-before>
      <SidebarDocInfo 
        v-if="isDocPage"
        :category="frontmatter.category"
        :date="frontmatter.date"
      />
    </template>

    <!-- 文档内容前的增强布局 -->
    <template #doc-before>
      <span id="main-content"></span>
      <div v-if="isDocPage" :class="$style.docHeaderContainer">
        <!-- 文档路径导航 -->
        <DocBreadcrumb />

        <!-- 文章元信息区域 -->
        <ArticleHeader 
          :show-quick-toc="showQuickTOC"
          @toggle-quick-toc="toggleQuickTOC"
        />

        <!-- 快速TOC预览 -->
        <QuickTOC 
          :is-visible="showQuickTOC"
          :headings="quickHeadings"
          @close="showQuickTOC = false"
        />
      </div>
    </template>

    <!-- 文档内容后的增强内容 -->
    <template #doc-after>
      <DocFooter 
        v-if="isDocPage"
        :word-count="wordCount"
        :reading-time="readingTime"
        :last-modified="lastModified"
        :related-articles="relatedArticles"
      />
    </template>

    <!-- 大纲前的增强内容 - 已禁用，隐藏右侧 aside -->
    <!-- 
    <template #aside-outline-before>
      <div v-if="isDocPage" class="outline-enhancements">
        <div class="doc-progress-indicator">
          <div class="progress-bar" :style="{ width: readingProgress + '%' }"></div>
        </div>
      </div>
    </template>
    -->

    <!-- 大纲后的增强内容 - 已禁用，隐藏右侧 aside -->
    <!-- 
    <template #aside-outline-after>
      <div v-if="isDocPage" class="outline-footer">
        <div class="outline-stats">
          <span class="heading-count">{{ headingCount }} sections</span>
        </div>
      </div>
    </template>
    -->
  </Layout>
  
  <!-- 增强版 TOC 组件 - 保留浮动 TOC 功能 -->
  <EnhancedTOC v-if="isDocPage" />
  
  <!-- 全局模态框组件 -->
  <CodeBlockModal />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress/client'
import DefaultTheme from 'vitepress/theme'

// 导入拆分后的组件
import LayoutEnhancementIndicator from './components/layout/LayoutEnhancementIndicator.vue'
import DocBreadcrumb from './components/layout/DocBreadcrumb.vue'
import ArticleHeader from './components/layout/ArticleHeader.vue'
import QuickTOC from './components/layout/QuickTOC.vue'
import DocFooter from './components/layout/DocFooter.vue'
import SidebarDocInfo from './components/layout/SidebarDocInfo.vue'

// 导入其他组件
import CodeBlockModal from './components/CodeBlockModal.vue'
import EnhancedTOC from './components/EnhancedTOC.vue'
import NavbarEnhancer from './components/NavbarEnhancer.vue'

// 导入 composable
import { useDocumentStats } from './composables/useDocumentStats.js'

const Layout = DefaultTheme.Layout
const { page, frontmatter } = useData()

// 使用文档统计 composable
const {
  readingProgress,
  wordCount,
  readingTime,
  headingCount,
  quickHeadings,
  lastModified,
  relatedArticles,
  updateQuickHeadings
} = useDocumentStats()

// 本地状态
const showQuickTOC = ref(false)

// 判断是否为文档页面
const isDocPage = computed(() => {
  if (!page.value) return false
  
  // 排除首页和特殊页面
  const excludePages = ['/', '/index', '/home', '/timeline', '/search', '/about']
  const currentPath = page.value.relativePath?.replace(/\.md$/, '') || ''
  const normalizedPath = '/' + currentPath
  
  if (excludePages.includes(normalizedPath) || excludePages.includes('/' + currentPath)) {
    return false
  }
  
  // 根据 frontmatter 判断
  const fm = frontmatter.value || {}
  if (fm.layout === 'home' || fm.layout === 'page') {
    return false
  }
  
  return true
})

// 方法
const toggleQuickTOC = () => {
  showQuickTOC.value = !showQuickTOC.value
  if (showQuickTOC.value) {
    updateQuickHeadings()
  }
}
</script>

<style module>
.navEnhancement {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  height: 40px; /* 与导航项保持一致 */
}

.docHeaderContainer {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1.5rem;
}
</style>