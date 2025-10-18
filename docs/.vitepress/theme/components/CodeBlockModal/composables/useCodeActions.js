import { ref, nextTick } from 'vue'
import { copyToClipboard, downloadFile } from '../utils.js'

export function useCodeActions(props) {
  const isCopied = ref(false)
  const showLineNumbers = ref(true)
  const lineNumbersRef = ref(null)
  const codeContentRef = ref(null)

  // 辅助：统一解包 props（支持普通对象与 Ref/Computed）
  const resolveProps = () => {
    return props && typeof props === 'object' && 'value' in props ? props.value : props
  }

  // 切换行号显示
  const toggleLineNumbers = () => {
    showLineNumbers.value = !showLineNumbers.value
    nextTick(() => {
      syncScroll()
    })
  }

  // 复制代码：优先使用 props.code；为空则从 DOM 中回退为纯文本
  const copyCode = async () => {
    const p = resolveProps()
    let textToCopy = (p && p.code) || ''

    if (!textToCopy) {
      const container = codeContentRef.value?.querySelector('.shiki-container')
      textToCopy = container?.textContent?.trim() || codeContentRef.value?.textContent?.trim() || ''
    }

    const success = await copyToClipboard(textToCopy)
    if (success) {
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    }
  }

  // 下载代码：避免 undefined，必要时从 DOM 回退
  const downloadCode = () => {
    const p = resolveProps()
    const container = codeContentRef.value?.querySelector('.shiki-container')
    const content = (p && p.code) || container?.textContent?.trim() || ''
    const filename = p?.filename
    const language = p?.language
    downloadFile(content, filename, language)
  }

  // 同步滚动
  const syncScroll = () => {
    if (lineNumbersRef.value && codeContentRef.value) {
      const codeContainer = codeContentRef.value.querySelector('.shiki-container')
      if (codeContainer) {
        lineNumbersRef.value.scrollTop = codeContainer.scrollTop
      }
    }
  }

  return {
    isCopied,
    showLineNumbers,
    lineNumbersRef,
    codeContentRef,
    toggleLineNumbers,
    copyCode,
    downloadCode,
    syncScroll
  }
}