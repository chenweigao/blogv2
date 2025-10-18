import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'
import './enhanced-toc.css'
import './styles/responsive-images.css'
import './styles/navbar-animations.css'
// 注意：以下CSS文件已整合到 custom.css 的模块化结构中，避免重复导入
// import './styles/code-block-fix.css'     // 已整合到 content.css
// import './styles/sidebar-effects.css'   // 已整合到 layout.css  
// import './styles/hover-effects.css'     // 已分散到各个相关模块
import ArticleMeta from './components/ArticleMeta.vue'
import PageTransition from './components/PageTransition.vue'
import ScrollAnimations from './components/ScrollAnimations.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import GitHistoryButton from './components/GitHistoryButton.vue'
import GitHistoryModal from './components/GitHistoryModal.vue'
import CodeBlockModal from './components/CodeBlockModal.vue'
import EnhancedTOC from './components/EnhancedTOC.vue'
import NavbarEnhancer from './components/NavbarEnhancer.vue'
import { h } from 'vue'
// 正确导入 vitepress-plugin-image-viewer
import 'viewerjs/dist/viewer.min.css'
import imageViewer from 'vitepress-plugin-image-viewer'
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vitepress'
import { createCodeBlockHandler } from './utils/codeBlockHandler.js'
import { useMermaid } from './composables/useMermaid.js'
import { setupSidebarNavbarSync } from './utils/sidebarNavbarSync.js'
import { initAnalytics } from './utils/analytics.js'
import { initErrorMonitor } from './utils/errorMonitor.js'
import { initWebVitals } from './utils/webVitals.js'

// 创建一个全局的代码块弹窗状态
const codeModalState = {
  visible: ref(false),
  data: ref({
    code: '',
    language: 'text'
  })
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ArticleMeta', ArticleMeta)
    app.component('PageTransition', PageTransition)
    app.component('ScrollAnimations', ScrollAnimations)
    app.component('ParticleBackground', ParticleBackground)
    app.component('GitHistoryButton', GitHistoryButton)
    app.component('GitHistoryModal', GitHistoryModal)
    app.component('CodeBlockModal', CodeBlockModal)
    app.component('EnhancedTOC', EnhancedTOC)
    app.component('NavbarEnhancer', NavbarEnhancer)
    
    // 提供全局的代码块弹窗状态
    app.provide('codeModalState', codeModalState)
  },
  setup() {
    const route = useRoute()
    
    // 创建代码块处理器
    const codeBlockHandler = createCodeBlockHandler(codeModalState)
    
    // 使用 mermaid composable
    const { setupMermaid } = useMermaid()
    
    // 延迟初始化 imageViewer：首张图片进入视口时再初始化
    let viewerInited = false
    const initImageViewerWhenNeeded = () => {
      if (viewerInited || typeof window === 'undefined') return
      const firstImage = document.querySelector('.vp-doc img')
      if (!('IntersectionObserver' in window)) {
        imageViewer(route); viewerInited = true; return
      }
      const io = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
          imageViewer(route)
          viewerInited = true
          io.disconnect()
        }
      }, { rootMargin: '0px', threshold: 0.1 })
      if (firstImage) io.observe(firstImage)
      else {
        // 如果当前无图，监听一次 DOM 变化，出现后再观察
        const mo = new MutationObserver(() => {
          const img = document.querySelector('.vp-doc img')
          if (img) {
            io.observe(img)
            mo.disconnect()
          }
        })
        mo.observe(document.body, { childList: true, subtree: true })
      }
    }
    
    // 只在客户端环境中初始化
    if (typeof window !== 'undefined') {
      onMounted(async () => {
        // 初始化代码块点击事件
        codeBlockHandler.initCodeBlockClick()
        
        // 初始化 mermaid
        await setupMermaid()
        // 延迟初始化图片查看
        initImageViewerWhenNeeded()
        // 初始化错误监控与 Web Vitals（仅生产）
        if (import.meta.env.PROD) {
          initErrorMonitor()
          initWebVitals()
        }
        // 设置侧边栏与导航栏同步
        const cleanupSidebarSync = setupSidebarNavbarSync()
        // 初始化隐私友好的站点分析（仅生产且显式启用）
        if (import.meta.env.PROD) {
          initAnalytics()
        }
        
        // 在组件卸载时清理
        const cleanup = () => {
          if (cleanupSidebarSync) {
            cleanupSidebarSync()
          }
        }
        
        // 注册清理函数（VitePress会在适当时候调用）
        if (typeof window !== 'undefined') {
          window.__vitepress_sidebar_cleanup = cleanup
        }
        
        if ('serviceWorker' in navigator && import.meta.env.PROD) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
              console.warn('Service Worker registration failed:', err)
            })
          })
        }
      })
      
      // 监听路由变化，重新初始化代码块点击事件和 mermaid
      watch(() => route.path, async () => {
        setTimeout(async () => {
          codeBlockHandler.initCodeBlockClick()
          await setupMermaid()
          
          // 路由切换后如果尚未初始化图片查看，尝试触发
          initImageViewerWhenNeeded()
           
          // 刷新导航栏高亮状态
          if (window.__refreshNavbarHighlight) {
            window.__refreshNavbarHighlight()
          }
        }, 100)
      })
    }
  }
}