import { languageConfig } from './constants.js'

// 获取语言显示名称
export const getDisplayLanguage = (language) => {
  const config = languageConfig[language.toLowerCase()]
  return config ? config.name : language.toUpperCase()
}

// 获取语言颜色
export const getLanguageColor = (language) => {
  const config = languageConfig[language.toLowerCase()]
  return config ? config.color : '#666666'
}

// HTML 转义
export const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// 复制到剪贴板
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackErr) {
      console.error('降级复制也失败:', fallbackErr)
      document.body.removeChild(textArea)
      return false
    }
  }
}

// 下载文件
export const downloadFile = (content, filename, language) => {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `code.${language}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}