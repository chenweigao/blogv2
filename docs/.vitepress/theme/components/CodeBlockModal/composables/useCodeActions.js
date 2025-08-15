import { ref, nextTick } from 'vue'
import { copyToClipboard, downloadFile } from '../utils.js'

export function useCodeActions(props) {
  const isCopied = ref(false)
  const showLineNumbers = ref(true)
  const lineNumbersRef = ref(null)
  const codeContentRef = ref(null)

  // 切换行号显示
  const toggleLineNumbers = () => {
    showLineNumbers.value = !showLineNumbers.value
    nextTick(() => {
      syncScroll()
    })
  }

  // 复制代码
  const copyCode = async () => {
    const success = await copyToClipboard(props.code)
    if (success) {
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    }
  }

  // 下载代码
  const downloadCode = () => {
    downloadFile(props.code, props.filename, props.language)
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