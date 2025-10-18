import { nextTick, ref, watch } from 'vue'
import { useData } from 'vitepress'

let mermaidInstance = null

// 主题配置映射
const THEME_CONFIG = {
  light: {
    theme: 'default',
    themeVariables: {
      primaryColor: '#3b82f6',
      primaryTextColor: '#1f2937',
      primaryBorderColor: '#e5e7eb',
      lineColor: '#6b7280',
      sectionBkgColor: '#f9fafb',
      altSectionBkgColor: '#ffffff',
      gridColor: '#e5e7eb',
      secondaryColor: '#f3f4f6',
      tertiaryColor: '#ffffff'
    }
  },
  dark: {
    theme: 'dark',
    themeVariables: {
      primaryColor: '#60a5fa',
      primaryTextColor: '#f9fafb',
      primaryBorderColor: '#374151',
      lineColor: '#9ca3af',
      sectionBkgColor: '#1f2937',
      altSectionBkgColor: '#111827',
      gridColor: '#374151',
      secondaryColor: '#374151',
      tertiaryColor: '#1f2937'
    }
  }
}

export function useMermaid() {
  const { isDark } = useData()
  const isInitialized = ref(false)
  
  // 获取当前主题配置
  const getCurrentThemeConfig = () => {
    const currentTheme = isDark.value ? 'dark' : 'light'
    return THEME_CONFIG[currentTheme]
  }

  const initMermaid = async (forceReinit = false) => {
    if (typeof window === 'undefined') return null
    
    try {
      // 动态导入 mermaid
      const mermaid = await import('mermaid')
      mermaidInstance = mermaid.default
      
      // 获取当前主题配置
      const themeConfig = getCurrentThemeConfig()
      
      // 初始化 mermaid
      mermaidInstance.initialize({
        startOnLoad: false,
        ...themeConfig,
        securityLevel: 'loose',
        fontFamily: 'monospace',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true
        },
        sequence: {
          useMaxWidth: true,
          wrap: true
        },
        gantt: {
          useMaxWidth: true
        }
      })
      
      isInitialized.value = true
      console.log(`[Mermaid] 初始化完成 - 主题: ${themeConfig.theme}`)
      return mermaidInstance
    } catch (error) {
      console.error('[Mermaid] 初始化失败:', error)
      return null
    }
  }

  const clearRenderedCharts = () => {
    // 清除已渲染的图表，恢复原始代码块
    const renderedElements = document.querySelectorAll('.language-mermaid.mermaid-rendered')
    renderedElements.forEach(element => {
      const originalCode = element.dataset.originalCode
      if (originalCode) {
        element.innerHTML = `<pre><code>${originalCode}</code></pre>`
        element.classList.remove('mermaid-rendered')
      }
    })
  }

  const renderMermaidCharts = async () => {
    if (typeof window === 'undefined' || !mermaidInstance || !isInitialized.value) return
    
    await nextTick()
    
    try {
      // 查找所有 mermaid 代码块
      const mermaidElements = document.querySelectorAll('.language-mermaid pre code')
      
      for (let i = 0; i < mermaidElements.length; i++) {
        const element = mermaidElements[i]
        const code = element.textContent || element.innerText
        
        if (!code.trim()) continue
        
        // 创建唯一 ID
        const id = `mermaid-${Date.now()}-${i}`
        
        try {
          // 验证语法
          await mermaidInstance.parse(code)
          
          // 渲染图表
          const { svg } = await mermaidInstance.render(id, code)
          
          // 替换代码块为 SVG
          const wrapper = element.closest('.language-mermaid')
          if (wrapper) {
            // 保存原始代码以便主题切换时恢复
            wrapper.dataset.originalCode = code
            wrapper.innerHTML = svg
            wrapper.classList.add('mermaid-rendered')
          }
        } catch (error) {
          console.error(`[Mermaid] 渲染图表失败 (${id}):`, error)
          // 保持原始代码块显示
        }
      }
      
      console.log(`[Mermaid] 渲染了 ${mermaidElements.length} 个图表`)
    } catch (error) {
      console.error('[Mermaid] 渲染过程出错:', error)
    }
  }

  const setupMermaid = async () => {
    const mermaid = await initMermaid()
    if (mermaid) {
      await renderMermaidCharts()
    }
  }

  const reinitializeWithTheme = async () => {
    if (!mermaidInstance) return
    
    console.log('[Mermaid] 主题变化，重新初始化...')
    
    // 清除已渲染的图表
    clearRenderedCharts()
    
    // 重新初始化 mermaid
    await initMermaid(true)
    
    // 重新渲染图表
    await renderMermaidCharts()
  }
 
  // 监听主题变化
  if (typeof window !== 'undefined') {
    let themeTimer = null
    let pending = false
    watch(isDark, async (newValue, oldValue) => {
      if (oldValue === undefined || newValue === oldValue) return
      if (themeTimer) clearTimeout(themeTimer)
      themeTimer = setTimeout(async () => {
        if (pending) return
        pending = true
        try {
          await reinitializeWithTheme()
        } finally {
          pending = false
        }
      }, 80)
    })
  }

  return {
    initMermaid,
    renderMermaidCharts,
    setupMermaid,
    reinitializeWithTheme,
    getCurrentThemeConfig
  }
}