import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ArticleMeta from './components/ArticleMeta.vue'
import PageTransition from './components/PageTransition.vue'
import ScrollAnimations from './components/ScrollAnimations.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import GitHistoryButton from './components/GitHistoryButton.vue'
import GitHistoryModal from './components/GitHistoryModal.vue'
import CodeBlockModal from './components/CodeBlockModal.vue'
import { h, provide, inject } from 'vue'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick, ref } from 'vue'
import { useRoute } from 'vitepress'

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
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ArticleMeta', ArticleMeta)
    app.component('PageTransition', PageTransition)
    app.component('ScrollAnimations', ScrollAnimations)
    app.component('ParticleBackground', ParticleBackground)
    app.component('GitHistoryButton', GitHistoryButton)
    app.component('GitHistoryModal', GitHistoryModal)
    app.component('CodeBlockModal', CodeBlockModal)
    
    // 提供全局的代码块弹窗状态
    app.provide('codeModalState', codeModalState)
  },
  setup() {
    const route = useRoute()
    
    const initZoom = () => {
      // 等待 DOM 更新完成后初始化 medium-zoom
      nextTick(() => {
        mediumZoom('.main img', {
          background: 'rgba(0, 0, 0, 0.8)',
          scrollOffset: 0,
          margin: 24
        })
      })
    }
    
    const initCodeBlockClick = () => {
      // 等待 DOM 更新完成后初始化代码块点击事件
      nextTick(() => {
        const codeBlocks = document.querySelectorAll('.main pre code, .main div[class*="language-"] code')
        
        codeBlocks.forEach(codeBlock => {
          // 移除之前的事件监听器（如果存在）
          codeBlock.removeEventListener('click', handleCodeBlockClick)
          
          // 添加点击事件监听器
          codeBlock.addEventListener('click', handleCodeBlockClick)
          
          // 添加鼠标悬停效果类名
          codeBlock.classList.add('clickable-code-block')
        })
      })
    }
    
    const handleCodeBlockClick = (event) => {
      event.preventDefault()
      event.stopPropagation()
      
      const codeElement = event.target.closest('code')
      if (!codeElement) return
      
      // 获取代码内容
      const codeText = codeElement.textContent || codeElement.innerText || ''
      
      // 获取语言类型
      let language = 'text'
      const preElement = codeElement.closest('pre')
      if (preElement) {
        const classNames = preElement.className || ''
        const languageMatch = classNames.match(/language-(\w+)/)
        if (languageMatch) {
          language = languageMatch[1]
        }
      }
      
      // 设置弹窗数据并显示
      codeModalState.data.value = {
        code: codeText,
        language: language
      }
      codeModalState.visible.value = true
    }
    
    onMounted(() => {
      initZoom()
      initCodeBlockClick()
    })
    
    watch(
      () => route.path,
      () => {
        initZoom()
        initCodeBlockClick()
      },
      { flush: 'post' }
    )
  },
  Layout() {
    const closeCodeModal = () => {
      codeModalState.visible.value = false
    }
    
    return h(PageTransition, null, {
      default: () => h(DefaultTheme.Layout, null, {
        // 在页面最外层添加粒子背景
        'layout-top': () => h(ParticleBackground, { 
          density: 30, 
          speed: 0.5, 
          showInteractive: true,
          theme: 'knowledge'
        }),
        // 在文档内容前插入文章元数据组件和历史记录按钮
        'doc-before': () => [
          h(ArticleMeta),
          h('div', { class: 'git-history-container', style: 'margin: 1rem 0; text-align: right;' }, [
            h(GitHistoryButton)
          ])
        ],
        // 在页面底部添加滚动动画组件和代码块弹窗
        'layout-bottom': () => [
          h(ScrollAnimations),
          h(CodeBlockModal, {
            visible: codeModalState.visible.value,
            code: codeModalState.data.value.code,
            language: codeModalState.data.value.language,
            onClose: closeCodeModal
          })
        ]
      })
    })
  }
}