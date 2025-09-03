<template>
  <Layout>
    <!-- 全局顶部内容 -->
    <template #layout-top>
      <div class="layout-enhancement-indicator"></div>
    </template>

    <!-- 导航栏标题后的内容 -->
    <template #nav-bar-title-after>
      <div class="nav-enhancement">
        <!-- 可以在这里添加导航增强功能 -->
      </div>
    </template>

    <!-- 侧边栏导航前的内容 -->
    <template #sidebar-nav-before>
      <div v-if="isDocPage" class="sidebar-doc-info">
        <div class="doc-meta-compact">
          <div class="doc-category" v-if="frontmatter.category">
            {{ frontmatter.category }}
          </div>
          <div class="doc-date" v-if="frontmatter.date">
            {{ formatDate(frontmatter.date) }}
          </div>
        </div>
      </div>
    </template>

    <!-- 文档内容前的增强布局 -->
    <template #doc-before>
      <div v-if="isDocPage" class="doc-header-container">
        <!-- 文档路径导航 -->
        <nav class="doc-breadcrumb" v-if="breadcrumbs.length > 0">
          <ol class="breadcrumb-list">
            <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
              <a v-if="crumb.link" :href="crumb.link" class="breadcrumb-link">
                {{ crumb.text }}
              </a>
              <span v-else class="breadcrumb-current">{{ crumb.text }}</span>
              <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
            </li>
          </ol>
        </nav>

        <!-- 文章元信息区域 -->
        <div class="article-header">
          <div class="article-meta-section">
            <ArticleMeta :show-reading-stats="false" />
          </div>
        </div>
        
        <!-- 统计信息和操作按钮行 -->
        <div class="doc-actions-bar">
          <!-- 左侧：阅读统计 -->
          <div class="reading-stats-section">
            <ReadingStats />
          </div>
          
          <!-- 右侧：操作按钮组 -->
          <div class="action-buttons">
            <GitHistoryButton />
            <button 
              class="toc-quick-toggle"
              @click="toggleQuickTOC"
              :title="showQuickTOC ? 'Hide Quick TOC' : 'Show Quick TOC'"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 快速TOC预览 -->
        <div v-if="showQuickTOC" class="quick-toc-preview">
          <div class="quick-toc-header">
            <h4>Quick Navigation</h4>
            <button @click="showQuickTOC = false" class="quick-toc-close">×</button>
          </div>
          <div class="quick-toc-content">
            <a 
              v-for="heading in quickHeadings" 
              :key="heading.anchor"
              :href="`#${heading.anchor}`"
              class="quick-toc-item"
              :class="`level-${heading.level}`"
              @click="showQuickTOC = false"
            >
              {{ heading.title }}
            </a>
          </div>
        </div>
      </div>
    </template>

    <!-- 文档内容后的增强内容 -->
    <template #doc-after>
      <div v-if="isDocPage" class="doc-footer-enhancements">
        <!-- 文档底部信息 -->
        <div class="doc-bottom-info">
          <div class="doc-stats">
            <span class="word-count">{{ wordCount }} words</span>
            <span class="reading-time">{{ readingTime }} min read</span>
            <span v-if="lastModified" class="last-modified">
              Updated: {{ formatDate(lastModified) }}
            </span>
          </div>
        </div>

        <!-- 相关文章推荐 -->
        <div v-if="relatedArticles.length > 0" class="related-articles">
          <h3>Related Articles</h3>
          <div class="related-list">
            <a 
              v-for="article in relatedArticles" 
              :key="article.link"
              :href="article.link"
              class="related-item"
            >
              <div class="related-title">{{ article.title }}</div>
              <div class="related-desc">{{ article.description }}</div>
            </a>
          </div>
        </div>
      </div>
    </template>

    <!-- 大纲前的增强内容 -->
    <template #aside-outline-before>
      <div v-if="isDocPage" class="outline-enhancements">
        <div class="doc-progress-indicator">
          <div class="progress-bar" :style="{ width: readingProgress + '%' }"></div>
        </div>
      </div>
    </template>

    <!-- 大纲后的增强内容 -->
    <template #aside-outline-after>
      <div v-if="isDocPage" class="outline-footer">
        <div class="outline-stats">
          <span class="heading-count">{{ headingCount }} sections</span>
        </div>
      </div>
    </template>
  </Layout>
  
  <!-- 增强版 TOC 组件 -->
  <EnhancedTOC v-if="isDocPage" />
  
  <!-- 全局模态框组件 -->
  <CodeBlockModal />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ArticleMeta from './components/ArticleMeta.vue'
import ReadingStats from './components/ReadingStats.vue'
import GitHistoryButton from './components/GitHistoryButton.vue'
import CodeBlockModal from './components/CodeBlockModal.vue'
import EnhancedTOC from './components/EnhancedTOC.vue'

const Layout = DefaultTheme.Layout
const { page, frontmatter } = useData()
const router = useRouter()

// 响应式状态
const showQuickTOC = ref(false)
const readingProgress = ref(0)
const wordCount = ref(0)
const readingTime = ref(0)
const headingCount = ref(0)
const quickHeadings = ref([])
const lastModified = ref('')
const relatedArticles = ref([])

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

// 生成面包屑导航
const breadcrumbs = computed(() => {
  if (!page.value?.relativePath) return []
  
  const pathParts = page.value.relativePath.replace(/\.md$/, '').split('/')
  const crumbs = []
  
  // 添加首页
  crumbs.push({ text: 'Home', link: '/' })
  
  // 添加路径层级
  let currentPath = ''
  for (let i = 0; i < pathParts.length - 1; i++) {
    currentPath += '/' + pathParts[i]
    crumbs.push({
      text: pathParts[i].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      link: currentPath + '/'
    })
  }
  
  // 添加当前页面
  if (pathParts.length > 0) {
    const currentTitle = frontmatter.value?.title || 
      pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    crumbs.push({ text: currentTitle })
  }
  
  return crumbs
})

// 工具函数
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const toggleQuickTOC = () => {
  showQuickTOC.value = !showQuickTOC.value
  if (showQuickTOC.value) {
    updateQuickHeadings()
  }
}

const updateQuickHeadings = () => {
  const headingElements = document.querySelectorAll('.vp-doc h1, .vp-doc h2, .vp-doc h3')
  quickHeadings.value = Array.from(headingElements).slice(0, 8).map(el => ({
    level: parseInt(el.tagName.charAt(1)),
    title: el.textContent || '',
    anchor: el.id || el.textContent?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || ''
  }))
}

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

const updateReadingProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  readingProgress.value = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
}

const handleScroll = () => {
  updateReadingProgress()
}

// 生命周期钩子
onMounted(() => {
  updateDocStats()
  updateReadingProgress()
  
  // 获取最后修改时间（如果有Git信息）
  if (frontmatter.value?.lastModified) {
    lastModified.value = frontmatter.value.lastModified
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 监听路由变化
  router.onAfterRouteChanged = () => {
    setTimeout(() => {
      updateDocStats()
      showQuickTOC.value = false
    }, 100)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ===== 布局增强指示器 ===== */
.layout-enhancement-indicator {
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  opacity: 0.8;
}

/* ===== 导航增强 ===== */
.nav-enhancement {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

/* ===== 侧边栏文档信息 ===== */
.sidebar-doc-info {
  padding: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.doc-meta-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.doc-category {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.doc-date {
  color: var(--vp-c-text-3);
}

/* ===== 文档头部容器 ===== */
.doc-header-container {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1.5rem;
}

/* ===== 面包屑导航 ===== */
.doc-breadcrumb {
  margin-bottom: 1.5rem;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-1);
}

.breadcrumb-current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--vp-c-text-3);
}

/* ===== 文章头部 ===== */
.article-header {
  margin-bottom: 1.5rem;
}

.article-meta-section {
  margin-bottom: 1rem;
}

/* ===== 文档操作栏 ===== */
.doc-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  gap: 2rem;
}

.reading-stats-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toc-quick-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toc-quick-toggle:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* ===== 快速TOC预览 ===== */
.quick-toc-preview {
  margin-top: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.quick-toc-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.quick-toc-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-toc-close:hover {
  color: var(--vp-c-text-1);
}

.quick-toc-content {
  padding: 0.5rem 0;
  max-height: 200px;
  overflow-y: auto;
}

.quick-toc-item {
  display: block;
  padding: 0.375rem 1rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.4;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
}

.quick-toc-item:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-left-color: var(--vp-c-brand-1);
}

.quick-toc-item.level-2 {
  padding-left: 1.5rem;
  font-size: 0.8125rem;
}

.quick-toc-item.level-3 {
  padding-left: 2rem;
  font-size: 0.75rem;
  opacity: 0.9;
}

/* ===== 文档底部增强 ===== */
.doc-footer-enhancements {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.doc-bottom-info {
  margin-bottom: 2rem;
}

.doc-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  flex-wrap: wrap;
}

.doc-stats span {
  display: flex;
  align-items: center;
}

/* ===== 相关文章 ===== */
.related-articles {
  margin-top: 2rem;
}

.related-articles h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.related-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.related-item {
  display: block;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.related-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.related-title {
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.related-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

/* ===== 大纲增强 ===== */
.outline-enhancements {
  margin-bottom: 1rem;
}

.doc-progress-indicator {
  height: 3px;
  background: var(--vp-c-bg-soft);
  border-radius: 1.5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 1.5px;
  transition: width 0.1s ease;
}

.outline-footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
}

.outline-stats {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-align: center;
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
  .doc-actions-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .action-buttons {
    align-self: flex-end;
  }
  
  .breadcrumb-list {
    flex-wrap: wrap;
  }
  
  .article-tags {
    margin-top: 0.5rem;
  }
  
  .doc-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .related-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .doc-header-container {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
  
  .quick-toc-content {
    max-height: 150px;
  }
  
  .sidebar-doc-info {
    padding: 0.75rem;
  }
}
</style>