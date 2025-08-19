import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'
import './enhanced-toc.css'
import './styles/code-block-fix.css'
import './styles/sidebar-effects.css'
import './styles/hover-effects.css'
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
    
    const initCodeBlockClick = () => {
      // 检查是否在客户端环境
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return
      }
      
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
      // 检查是否在客户端环境
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return
      }
      
      console.log('[CodeBlock] 代码块被点击')
      event.preventDefault()
      event.stopPropagation()
      
      const codeElement = event.target.closest('code')
      if (!codeElement) {
        console.log('[CodeBlock] 未找到code元素')
        return
      }
      
      // 立即清除focus状态，防止悬停样式变化
      codeElement.blur()
      const preElement = codeElement.closest('pre')
      if (preElement) {
        preElement.blur()
      }
      
      // 添加临时类名用于样式重置动画
      codeElement.classList.add('clicked')
      setTimeout(() => {
        codeElement.classList.remove('clicked')
      }, 100)
      
      // 延迟确保focus状态被完全清除
      setTimeout(() => {
        if (document.activeElement === codeElement || document.activeElement === preElement) {
          document.activeElement.blur()
        }
        // 强制重置任何可能的focus相关样式
        codeElement.style.outline = 'none'
        if (preElement) {
          preElement.style.outline = 'none'
        }
      }, 0)
      
      // 获取代码内容
      const codeText = codeElement.textContent || codeElement.innerText || ''
      console.log('[CodeBlock] 代码内容长度:', codeText.length)
      
      // 改进的语言类型检测逻辑
      let language = 'text'
      
      // 检查多个可能包含语言信息的元素
      const elementsToCheck = [
        codeElement,                    // code 元素本身
        codeElement.closest('pre'),     // pre 元素
        codeElement.closest('div'),     // 包含的 div 元素
        codeElement.parentElement,      // 直接父元素
        codeElement.parentElement?.parentElement  // 祖父元素
      ].filter(Boolean)
      
      // 需要排除的辅助类名
      const excludeClasses = [
        'clickable-code-block',
        'code-block',
        'highlight',
        'hljs',
        'prism',
        'shiki',
        'line-numbers',
        'line-highlight'
      ]
      
      // 尝试从各种可能的位置提取语言类型
      for (const element of elementsToCheck) {
        if (!element) continue
        
        const classNames = element.className || ''
        console.log('[CodeBlock] 检查元素类名:', element.tagName, classNames)
        
        // 将类名分割成数组，逐个检查
        const classList = classNames.split(/\s+/).filter(cls => cls.trim())
        
        for (const className of classList) {
          // 跳过排除的辅助类名
          if (excludeClasses.some(exclude => className.includes(exclude))) {
            continue
          }
          
          // 匹配各种可能的语言类名模式
          const patterns = [
            /^language-(\w+)$/,         // language-xxx (精确匹配)
            /^lang-(\w+)$/,             // lang-xxx (精确匹配)
            /^highlight-(\w+)$/,        // highlight-xxx (精确匹配)
            /^(\w+)-highlight$/,        // xxx-highlight (精确匹配)
          ]
          
          for (const pattern of patterns) {
            const match = className.match(pattern)
            if (match && match[1]) {
              const extractedLang = match[1].toLowerCase()
              // 确保提取的是有效的编程语言名称
              if (isValidLanguage(extractedLang)) {
                language = extractedLang
                console.log('[CodeBlock] 从类名中提取到语言:', language, '来源类名:', className)
                break
              }
            }
          }
          
          if (language !== 'text') break
        }
        
        if (language !== 'text') break
      }
      
      // 如果还是没找到，尝试从 data 属性中获取
      if (language === 'text') {
        for (const element of elementsToCheck) {
          if (!element) continue
          
          const dataLang = element.getAttribute('data-language') || 
                          element.getAttribute('data-lang') ||
                          element.getAttribute('data-highlight-lang')
          
          if (dataLang && isValidLanguage(dataLang.toLowerCase())) {
            language = dataLang.toLowerCase()
            console.log('[CodeBlock] 从 data 属性中提取到语言:', language)
            break
          }
        }
      }
      
      // 最后尝试从文本内容推断（针对一些特殊情况）
      if (language === 'text' && codeText) {
        language = inferLanguageFromContent(codeText)
        if (language !== 'text') {
          console.log('[CodeBlock] 从代码内容推断出语言:', language)
        }
      }
      
      console.log('[CodeBlock] 最终检测到语言:', language)
      
      // 设置弹窗数据并显示
      codeModalState.data.value = {
        code: codeText,
        language: language
      }
      codeModalState.visible.value = true
      console.log('[CodeBlock] 弹窗已显示')
    }
    
    // 检查是否为有效的编程语言名称
    const isValidLanguage = (lang) => {
      const validLanguages = [
        'javascript', 'js', 'typescript', 'ts', 'python', 'py', 'java', 
        'cpp', 'c', 'css', 'html', 'json', 'xml', 'yaml', 'yml',
        'markdown', 'md', 'bash', 'shell', 'sh', 'sql', 'php', 'go',
        'rust', 'vue', 'jsx', 'tsx', 'swift', 'kotlin', 'dart', 'ruby',
        'scala', 'r', 'matlab', 'powershell', 'dockerfile', 'nginx', 
        'apache', 'perl', 'lua', 'haskell', 'clojure', 'erlang', 'elixir',
        'fsharp', 'csharp', 'vb', 'objective-c', 'assembly', 'asm',
        'makefile', 'cmake', 'gradle', 'maven', 'ant', 'properties',
        'ini', 'toml', 'conf', 'config', 'log', 'diff', 'patch'
      ]
      return validLanguages.includes(lang)
    }
    
    // 从代码内容推断语言类型
    const inferLanguageFromContent = (code) => {
      const trimmedCode = code.trim()
      
      // JavaScript/TypeScript 特征
      if (/^(import|export|const|let|var|function|class|\{|\[)/.test(trimmedCode) ||
          /\.(js|ts|jsx|tsx)$/.test(trimmedCode) ||
          /console\.log|require\(|module\.exports/.test(trimmedCode)) {
        return 'javascript'
      }
      
      // Python 特征
      if (/^(def|class|import|from|if __name__|print\(|#!)/.test(trimmedCode) ||
          /\.py$/.test(trimmedCode)) {
        return 'python'
      }
      
      // Java 特征
      if (/^(public|private|protected|class|interface|package|import)/.test(trimmedCode) ||
          /System\.out\.println|\.java$/.test(trimmedCode)) {
        return 'java'
      }
      
      // Shell/Bash 特征 - 修复 shebang 语法错误
      if (/^(\x23\x21\/bin\/bash|\x23\x21\/bin\/sh|\$|#)/.test(trimmedCode) ||
          /\.(sh|bash)$/.test(trimmedCode)) {
        return 'bash'
      }
      
      // CSS 特征
      if (/^(\.|#|\*|@|:)/.test(trimmedCode) ||
          /\.(css|scss|sass|less)$/.test(trimmedCode) ||
          /{[^}]*}/.test(trimmedCode)) {
        return 'css'
      }
      
      // HTML 特征
      if (/^<!DOCTYPE|^<html|^<\w+/.test(trimmedCode) ||
          /\.(html|htm)$/.test(trimmedCode)) {
        return 'html'
      }
      
      // JSON 特征
      if (/^[\{\[]/.test(trimmedCode) && /[\}\]]$/.test(trimmedCode) ||
          /\.(json)$/.test(trimmedCode)) {
        return 'json'
      }
      
      return 'text'
    }
    
    // 只在客户端环境中初始化
    if (typeof window !== 'undefined') {
      onMounted(() => {
        initCodeBlockClick()
      })
      
      // 监听路由变化，重新初始化代码块点击事件
      watch(() => route.path, () => {
        setTimeout(() => {
          initCodeBlockClick()
        }, 100)
      })
    }
  }
}