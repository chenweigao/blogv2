import { nextTick } from 'vue'

/**
 * 代码块点击处理器
 * 负责初始化代码块点击事件和处理点击逻辑
 */
export class CodeBlockHandler {
  constructor(codeModalState) {
    this.codeModalState = codeModalState
    this._bound = false
    this._listener = (e) => {
      const target = e.target
      if (!target) return
      // 统一从目标向上查找最近的 code 与 pre，兼容 Shiki 结构
      const codeEl = target.closest && target.closest('code')
      const preEl = codeEl && codeEl.closest('pre')
      if (!codeEl || !preEl) return
      // 仅当位于文档区域内时触发（避免导航/非文档区域误触）
      const docRoot = document.querySelector('.vp-doc') || document.body
      if (!docRoot.contains(codeEl)) return
      this.handleCodeBlockClick(e)
    }
    this._isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
  }

  /**
   * 初始化代码块点击事件
   */
  initCodeBlockClick() {
    // 检查是否在客户端环境
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }
    
    if (this._bound) return
    this._bound = true
    // 事件委托：在文档容器或 document 上绑定一次
    const container = document.querySelector('.vp-doc') || document
    container.addEventListener('click', this._listener, { passive: false })
  }

  /**
   * 处理代码块点击事件
   */
  handleCodeBlockClick(event) {
    // 检查是否在客户端环境
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }
    
    if (this._isDev) console.log('[CodeBlock] 代码块被点击')
    event.preventDefault()
    event.stopPropagation()
    
    const codeElement = event.target.closest('code')
    if (!codeElement) {
      if (this._isDev) console.log('[CodeBlock] 未找到code元素')
      return
    }
    // 忽略行内 code：必须在 pre 内
    const preElement = codeElement.closest('pre')
    if (!preElement) {
      if (this._isDev) console.log('[CodeBlock] 非预格式代码，忽略')
      return
    }
    
    // 立即清除focus状态，防止悬停样式变化
    codeElement.blur()
    preElement.blur()
    
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
      preElement.style.outline = 'none'
    }, 0)
    
    // 获取代码内容
    const codeText = codeElement.textContent || codeElement.innerText || ''
    if (this._isDev) console.log('[CodeBlock] 代码内容长度:', codeText.length)
    
    // 简化的语言检测逻辑
    const language = this.detectLanguage(codeElement)
    if (this._isDev) console.log('[CodeBlock] 检测到语言:', language)
    
    // 设置弹窗数据并显示
    this.codeModalState.data.value = {
      code: codeText,
      language: language
    }
    this.codeModalState.visible.value = true
    if (this._isDev) console.log('[CodeBlock] 弹窗已显示')
  }

  /**
   * 简化的语言检测函数
   */
  detectLanguage(codeElement) {
    // 检查最常见的类名模式
    const elementsToCheck = [
      codeElement.closest('div'),     // 包含的 div 元素（VitePress 常用）
      codeElement.closest('pre'),     // pre 元素
      codeElement                     // code 元素本身
    ].filter(Boolean)
    
    for (const element of elementsToCheck) {
      const className = element.className || ''
      
      // 匹配 language-xxx 模式
      const match = className.match(/language-(\w+)/)
      if (match && match[1]) {
        return match[1].toLowerCase()
      }
    }
    
    // 如果检测不到，直接返回 text
    return 'text'
  }
}

/**
 * 创建代码块处理器实例的工厂函数
 */
export function createCodeBlockHandler(codeModalState) {
  return new CodeBlockHandler(codeModalState)
}