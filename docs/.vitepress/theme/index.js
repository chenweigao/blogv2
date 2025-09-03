import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'
import './enhanced-toc.css'
import './styles/responsive-images.css'
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
import { h } from 'vue'
// 正确导入 vitepress-plugin-image-viewer
import 'viewerjs/dist/viewer.min.css'
import imageViewer from 'vitepress-plugin-image-viewer'
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vitepress'
import { createCodeBlockHandler } from './utils/codeBlockHandler.js'
import { useMermaid } from './composables/useMermaid.js'

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
    
    // 提供全局的代码块弹窗状态
    app.provide('codeModalState', codeModalState)
  },
  setup() {
    const route = useRoute()
    
    // 使用 vitepress-plugin-image-viewer，按照官方文档的正确方式
    imageViewer(route)
    
    // 创建代码块处理器
    const codeBlockHandler = createCodeBlockHandler(codeModalState)
    
    // 使用 mermaid composable
    const { setupMermaid } = useMermaid()
    
    // 只在客户端环境中初始化
    if (typeof window !== 'undefined') {
      onMounted(async () => {
        // 初始化代码块点击事件
        codeBlockHandler.initCodeBlockClick()
        
        // 初始化 mermaid
        await setupMermaid()
      })
      
      // 监听路由变化，重新初始化代码块点击事件和 mermaid
      watch(() => route.path, async () => {
        setTimeout(async () => {
          codeBlockHandler.initCodeBlockClick()
          await setupMermaid()
        }, 100)
      })
    }
  }
}