import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ArticleMeta from './components/ArticleMeta.vue'
import PageTransition from './components/PageTransition.vue'
import ScrollAnimations from './components/ScrollAnimations.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import GitHistoryButton from './components/GitHistoryButton.vue'
import GitHistoryModal from './components/GitHistoryModal.vue'
import CodeBlockModal from './components/CodeBlockModal.vue'
import { h } from 'vue'
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
        // 更广泛的选择器，包括VitePress的各种代码块格式
        const selectors = [
          '.vp-doc pre code',
          '.main pre code', 
          'div[class*="language-"] pre code',
          '.language-js pre code',
          '.language-javascript pre code',
          '.language-python pre code',
          '.language-java pre code',
          '.language-css pre code',
          '.language-html pre code',
          '.language-json pre code',
          '.language-bash pre code',
          '.language-shell pre code',
          'pre code'
        ]
        
        let foundBlocks = 0
        selectors.forEach(selector => {
          const codeBlocks = document.querySelectorAll(selector)
          codeBlocks.forEach(codeBlock => {
            // 避免重复绑定
            if (!codeBlock.classList.contains('clickable-code-block')) {
              // 添加点击事件监听器
              codeBlock.addEventListener('click', handleCodeBlockClick)
              
              // 添加鼠标悬停效果类名
              codeBlock.classList.add('clickable-code-block')
              foundBlocks++
            }
          })
        })
        
        console.log(`[CodeBlock] 找到并绑定了 ${foundBlocks} 个代码块`)
      })
    }
    
    const handleCodeBlockClick = (event) => {
      console.log('[CodeBlock] 代码块被点击')
      event.preventDefault()
      event.stopPropagation()
      
      const codeElement = event.target.closest('code')
      if (!codeElement) {
        console.log('[CodeBlock] 未找到code元素')
        return
      }
      
      // 获取代码内容
      const codeText = codeElement.textContent || codeElement.innerText || ''
      console.log('[CodeBlock] 代码内容长度:', codeText.length)
      
      // 获取语言类型
      let language = 'text'
      const preElement = codeElement.closest('pre')
      if (preElement) {
        const classNames = preElement.className || preElement.parentElement?.className || ''
        const languageMatch = classNames.match(/language-(\w+)/)
        if (languageMatch) {
          language = languageMatch[1]
        }
      }
      
      console.log('[CodeBlock] 检测到语言:', language)
      
      // 设置弹窗数据并显示
      codeModalState.data.value = {
        code: codeText,
        language: language
      }
      codeModalState.visible.value = true
      console.log('[CodeBlock] 弹窗已显示')
    }
    
    onMounted(() => {
      console.log('[CodeBlock] 组件已挂载，初始化功能')
      initZoom()
      initCodeBlockClick()
    })
    
    watch(
      () => route.path,
      () => {
        console.log('[CodeBlock] 路由变化，重新初始化')
        initZoom()
        // 延迟一点时间确保DOM更新完成
        setTimeout(() => {
          initCodeBlockClick()
        }, 500)
      },
      { flush: 'post' }
    )
  },
  Layout() {
    const closeCodeModal = () => {
      console.log('[CodeBlock] 关闭弹窗')
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