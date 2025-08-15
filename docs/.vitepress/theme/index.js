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
      return validLanguages.includes(lang.toLowerCase())
    }
    
    // 从代码内容推断语言类型
    const inferLanguageFromContent = (codeText) => {
      const content = codeText.toLowerCase().trim()
      
      // JavaScript/TypeScript
      if (content.includes('function ') || content.includes('const ') || 
          content.includes('let ') || content.includes('var ') ||
          content.includes('=>') || content.includes('console.log')) {
        return content.includes('interface ') || content.includes(': string') || 
               content.includes(': number') ? 'typescript' : 'javascript'
      }
      
      // Python
      if (content.includes('def ') || content.includes('import ') || 
          content.includes('from ') || content.includes('print(') ||
          content.includes('if __name__')) {
        return 'python'
      }
      
      // Java
      if (content.includes('public class ') || content.includes('private ') ||
          content.includes('system.out.println') || content.includes('public static void main')) {
        return 'java'
      }
      
      // PHP
      if (content.includes('<?php') || content.includes('echo ') || 
          content.includes('$_') || content.startsWith('<?')) {
        return 'php'
      }
      
      // C/C++
      if (content.includes('#include') || content.includes('printf(') ||
          content.includes('int main(') || content.includes('cout <<')) {
        return content.includes('cout') || content.includes('std::') ? 'cpp' : 'c'
      }
      
      // CSS
      if (content.includes('{') && content.includes('}') && 
          (content.includes(':') && content.includes(';'))) {
        return 'css'
      }
      
      // HTML
      if (content.includes('<html') || content.includes('<!doctype') ||
          content.includes('<div') || content.includes('<span')) {
        return 'html'
      }
      
      // JSON
      if ((content.startsWith('{') && content.endsWith('}')) ||
          (content.startsWith('[') && content.endsWith(']'))) {
        try {
          JSON.parse(codeText)
          return 'json'
        } catch (e) {
          // 不是有效的JSON
        }
      }
      
      // Shell/Bash
      if (content.includes('#!/bin/bash') || content.includes('#!/bin/sh') ||
          content.includes('echo ') || content.includes('grep ') ||
          content.includes('awk ') || content.includes('sed ')) {
        return 'bash'
      }
      
      // SQL
      if (content.includes('select ') || content.includes('insert ') ||
          content.includes('update ') || content.includes('delete ') ||
          content.includes('create table')) {
        return 'sql'
      }
      
      return 'text'
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