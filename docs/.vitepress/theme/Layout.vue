## Here's my code: 
<template>
  <Layout>
    <!-- 全局顶部内容 -->
    <template #layout-top>
      <a href="#main-content" class="skip-to-content visually-hidden-focusable u-focus-ring focus-ring-animated underline-center hover-pop press-active">跳转到正文</a>
      <LayoutEnhancementIndicator />
    </template>

    <!-- 导航栏标题后的内容 -->
    <template #nav-bar-title-after>
      <div :class="$style.navEnhancement" class="group group-hover-elevate">
        <!-- 可以在这里添加导航增强功能 -->
      </div>
    </template>

    <!-- 导航栏增强组件：添加悬浮与按压反馈 -->
    <template #nav-screen-content-after>
      <NavbarEnhancer class="hover-pop press-active" />
    </template>

    <!-- 侧边栏导航前的内容：添加滚动入场与模糊淡入 -->
    <template #sidebar-nav-before>
      <SidebarDocInfo 
        v-if="isDocPage"
        class="auto-inview effect-blur-in"
        :category="frontmatter.category"
        :date="frontmatter.date"
      />
    </template>

    <!-- 文档内容前的增强布局：包裹过渡，添加 3D 视差与交互反馈 -->
    <template #doc-before>
      <span id="main-content"></span>
      <Transition name="fade-slide">
        <div v-if="isDocPage" :class="$style.docHeaderContainer" class="stagger-inview">
          <!-- 文档路径导航：轻度 3D 视差与悬浮微动 -->
          <div class="tilt-3d">
            <div class="tilt-3d-item">
              <DocBreadcrumb class="hover-pop" />
            </div>
          </div>

          <!-- 文章元信息区域：悬浮与按压反馈 -->
          <ArticleHeader 
            class="hover-pop press-active"
            :show-quick-toc="showQuickTOC"
            @toggle-quick-toc="toggleQuickTOC"
          />

          <!-- 快速TOC预览：使用 v-show 包裹并添加过渡 -->
          <Transition name="scale-fade">
            <div v-show="showQuickTOC">
              <QuickTOC 
                :is-visible="showQuickTOC"
                :headings="quickHeadings"
                @close="showQuickTOC = false"
              />
            </div>
          </Transition>
        </div>
      </Transition>
    </template>

    <!-- 文档内容后的增强内容：包裹过渡与滚动入场 -->
    <template #doc-after>
      <Transition name="fade-slide">
        <DocFooter 
          v-if="isDocPage"
          class="auto-inview"
          :word-count="wordCount"
          :reading-time="readingTime"
          :last-modified="lastModified"
          :related-articles="relatedArticles"
        />
      </Transition>
    </template>

    <!-- 已禁用的右侧 aside 保持原状 -->
  </Layout>
  
  <!-- 增强版 TOC 组件 - 保留浮动 TOC 功能：包裹过渡与交互反馈 -->
  <Transition name="fade-slide">
    <EnhancedTOC v-if="isDocPage" class="hover-pop" />
  </Transition>
  
  <!-- 全局模态框组件：添加细腻入场 -->
  <CodeBlockModal class="effect-blur-in" />
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
  margin-inline-start: 1rem;
  height: 40px; /* 与导航项保持一致 */
}

.docHeaderContainer {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1.5rem;
}
</style>

<!-- 新增：全局过渡样式（Vue Transition），使用 transform+opacity 高性能属性 -->
<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    transform var(--motion-duration-medium) var(--motion-ease-spring),
    opacity var(--motion-duration-medium) var(--motion-ease-decelerate);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  transform: translateY(8px);
  opacity: 0;
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition:
    opacity var(--motion-duration-medium) var(--motion-ease-decelerate),
    transform var(--motion-duration-medium) var(--motion-ease-spring);
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(6px);
}
.scale-fade-enter-to,
.scale-fade-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Reduced Motion：禁用新增过渡 */
@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active,
  .scale-fade-enter-active,
  .scale-fade-leave-active {
    transition: none !important;
  }
}
</style>