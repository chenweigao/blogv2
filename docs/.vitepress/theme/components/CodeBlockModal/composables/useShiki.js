import { ref, computed } from 'vue'
import { createHighlighter } from 'shiki'
import { themes, supportedLanguages } from '../constants.js'
import { escapeHtml } from '../utils.js'

export function useShiki() {
  const highlighter = ref(null)
  const currentTheme = ref('github-light')

  // 初始化 Shiki 高亮器
  const initHighlighter = async () => {
    try {
      highlighter.value = await createHighlighter({
        themes: themes,
        langs: supportedLanguages
      })
    } catch (error) {
      console.error('Failed to initialize Shiki highlighter:', error)
    }
  }

  // 获取高亮后的代码
  const getHighlightedCode = (code, language, highlightedLines = []) => {
    if (!code || !highlighter.value) {
      return `<pre><code>${escapeHtml(code)}</code></pre>`
    }
    
    try {
      const html = highlighter.value.codeToHtml(code, {
        lang: language,
        theme: currentTheme.value,
        transformers: [
          // 添加行高亮支持
          {
            line(node, line) {
              if (highlightedLines.includes(line)) {
                node.properties.class = (node.properties.class || '') + ' highlighted-line'
              }
            }
          }
        ]
      })
      return html
    } catch (error) {
      console.warn('Shiki highlighting failed:', error)
      return `<pre><code>${escapeHtml(code)}</code></pre>`
    }
  }

  // 切换主题
  const toggleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    currentTheme.value = themes[nextIndex]
  }

  return {
    highlighter,
    currentTheme,
    initHighlighter,
    getHighlightedCode,
    toggleTheme
  }
}