import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'
import './enhanced-toc.css'
import './styles/responsive-images.css'
import './styles/navbar-animations.css'
// 新增：移动端样式覆盖
import './styles/mobile.css'
// 新增：侧边栏动态组件样式
import './styles/sidebar-widget.css'
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
import MermaidModal from './components/MermaidModal.vue'
import EnhancedTOC from './components/EnhancedTOC.vue'
import NavbarEnhancer from './components/NavbarEnhancer.vue'
// 移除未使用的 `h` 引入
//// 正确导入 vitepress-plugin-image-viewer
import 'viewerjs/dist/viewer.min.css'
import imageViewer from 'vitepress-plugin-image-viewer'
import { onMounted, watch, ref, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { createCodeBlockHandler } from './utils/codeBlockHandler.js'
import { useMermaid, setMermaidModalState } from './composables/useMermaid.js'
import { setupSidebarNavbarSync } from './utils/sidebarNavbarSync.js'
import { initAnalytics } from './utils/analytics.js'
import { initErrorMonitor } from './utils/errorMonitor.js'
import { initWebVitals } from './utils/webVitals.js'
import 'uno.css'
import './custom.css'
import './enhanced-toc.css'

// 创建一个全局的代码块弹窗状态
const codeModalState = {
  visible: ref(false),
  data: ref({
    code: '',
    language: 'text'
  })
}

// 创建一个全局的 Mermaid 弹窗状态
const mermaidModalState = {
  visible: ref(false),
  data: ref({
    svg: '',
    source: ''
  })
}

// 设置 Mermaid 弹窗状态引用
setMermaidModalState(mermaidModalState)

// 基于项目 base 路径注册 Service Worker，避免在子路径下 404
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
  const base = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/'
  const swUrl = (base.endsWith('/') ? base : base + '/') + 'sw.js'
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl).catch((err) => {
      console.warn('Service Worker registration failed:', err)
    })
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
    app.component('MermaidModal', MermaidModal)
    app.component('EnhancedTOC', EnhancedTOC)
    app.component('NavbarEnhancer', NavbarEnhancer)
    
    // 提供全局的代码块弹窗状态
    app.provide('codeModalState', codeModalState)
    // 提供全局的 Mermaid 弹窗状态
    app.provide('mermaidModalState', mermaidModalState)
  },
  setup() {
    const route = useRoute()
    
    // 创建代码块处理器
    const codeBlockHandler = createCodeBlockHandler(codeModalState)
    
    // 使用自定义 mermaid composable
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

        // 初始化自定义 mermaid
        await setupMermaid()

        // 修复：立即初始化图片查看插件，确保绑定点击事件
        try {
          imageViewer(route)
        } catch (e) {
          console.warn('imageViewer init failed:', e?.message || e)
        }

        // 仍保留延迟初始化策略作为兜底（若首屏没有图片或需要重试）
        initImageViewerWhenNeeded()

        // 监听文档区域的图片变化，出现新图片时自动重新初始化
        const docRoot = document.querySelector('.vp-doc') || document.body
        let mo
        if ('MutationObserver' in window && docRoot) {
          mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
              if (m.addedNodes && m.addedNodes.length) {
                const hasImg = Array.from(m.addedNodes).some(
                  (n) => (n.nodeType === 1 && ((n.tagName === 'IMG') || (n.querySelector && n.querySelector('img'))))
                )
                if (hasImg) {
                  try {
                    imageViewer(route)
                  } catch (e) {
                    // 忽略单次失败
                  }
                  break
                }
              }
            }
          })
          mo.observe(docRoot, { childList: true, subtree: true })
        }

        // 设置侧边栏与导航栏同步
        const cleanupSidebarSync = setupSidebarNavbarSync()

        // 初始化错误监控与分析（仅生产）
        if (import.meta.env.PROD) {
          initErrorMonitor()
          initWebVitals()
          initAnalytics()
        }

        // 清理：在卸载时断开观察器
        onUnmounted(() => {
          if (mo) mo.disconnect()
          if (typeof cleanupSidebarSync === 'function') {
            cleanupSidebarSync()
          }
        })
      })

      // 路由变化时重新初始化图片查看插件，确保新页面的图片可用
      watch(() => route.path, async () => {
        setTimeout(async () => {
          codeBlockHandler.initCodeBlockClick()
          // 路由变化时重新初始化 mermaid 渲染器
          initMermaidRenderer()
          await setupMermaid()

          // 修复：路由切换后立即初始化并记录失败原因
          try {
            imageViewer(route)
          } catch (e) {
            console.warn('imageViewer re-init failed:', e?.message || e)
          }

          // 若尚未初始化，尝试触发延迟初始化
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