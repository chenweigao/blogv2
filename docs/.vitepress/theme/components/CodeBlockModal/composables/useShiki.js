import { ref, computed } from 'vue'
import { createHighlighter } from 'shiki'
import { themes, supportedLanguages } from '../constants.js'
import { escapeHtml } from '../utils.js'

export function useShiki() {
  const highlighter = ref(null)
  const currentTheme = ref('github-light')
  const isLoading = ref(false)

  // 初始化 Shiki 高亮器
  const initHighlighter = async () => {
    if (highlighter.value || isLoading.value) return
    
    isLoading.value = true
    try {
      // 使用保守的主题和语言列表进行初始化
      highlighter.value = await createHighlighter({
        themes: ['github-light', 'github-dark', 'monokai', 'nord', 'one-dark-pro', 'dracula'],
        langs: [
          'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
          'css', 'html', 'json', 'yaml', 'markdown',
          'bash', 'shell', 'sql', 'php', 'go', 'rust',
          'vue', 'jsx', 'tsx'
        ]
      })
    } catch (error) {
      console.error('Failed to initialize Shiki highlighter:', error)
      // 如果失败，尝试最基本的配置
      try {
        highlighter.value = await createHighlighter({
          themes: ['github-light', 'github-dark'],
          langs: ['javascript', 'typescript', 'python', 'java', 'html', 'css', 'json']
        })
      } catch (fallbackError) {
        console.error('Fallback highlighter initialization failed:', fallbackError)
      }
    } finally {
      isLoading.value = false
    }
  }

  // 获取高亮后的代码
  const getHighlightedCode = (code, language, highlightedLines = []) => {
    if (!code) {
      return `<pre><code></code></pre>`
    }

    if (!highlighter.value) {
      return `<pre><code>${escapeHtml(code)}</code></pre>`
    }
    
    try {
      // 语言映射，确保使用支持的语言
      const langMap = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'sh': 'bash',
        'yml': 'yaml',
        'md': 'markdown'
      }
      
      let lang = langMap[language] || language
      
      // 如果语言不支持，使用 text
      const supportedLangs = ['javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'css', 'html', 'json', 'yaml', 'markdown', 'bash', 'shell', 'sql', 'php', 'go', 'rust', 'vue', 'jsx', 'tsx']
      if (!supportedLangs.includes(lang)) {
        lang = 'text'
      }
      
      const html = highlighter.value.codeToHtml(code, {
        lang: lang,
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
      // 降级处理：返回带基本样式的代码
      return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
    }
  }

  // 切换主题
  const toggleTheme = () => {
    const availableThemes = ['github-light', 'github-dark', 'monokai', 'nord', 'one-dark-pro', 'dracula']
    const currentIndex = availableThemes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % availableThemes.length
    currentTheme.value = availableThemes[nextIndex]
  }

  return {
    highlighter,
    currentTheme,
    isLoading,
    initHighlighter,
    getHighlightedCode,
    toggleTheme
  }
}