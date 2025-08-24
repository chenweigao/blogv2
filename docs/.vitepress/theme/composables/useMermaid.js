import { nextTick, onMounted, onUnmounted } from 'vue'

let mermaidInstance = null

export function useMermaid() {
  const initMermaid = async () => {
    if (typeof window === 'undefined') return
    
    try {
      // 动态导入 mermaid
      const mermaid = await import('mermaid')
      mermaidInstance = mermaid.default
      
      // 初始化 mermaid
      mermaidInstance.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'monospace'
      })
      
      console.log('[Mermaid] 初始化完成')
      return mermaidInstance
    } catch (error) {
      console.error('[Mermaid] 初始化失败:', error)
      return null
    }
  }

  const renderMermaidCharts = async () => {
    if (typeof window === 'undefined' || !mermaidInstance) return
    
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

  return {
    initMermaid,
    renderMermaidCharts,
    setupMermaid
  }
}