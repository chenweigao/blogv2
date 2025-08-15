<template>
  <div v-if="isVisible" class="code-modal-overlay" @click="closeModal">
    <div class="code-modal-container" @click.stop>
      <div class="code-modal-header">
        <div class="code-modal-title">
          <span class="code-language">{{ displayLanguage }}</span>
          <span class="code-title">代码块</span>
        </div>
        <div class="code-modal-actions">
          <button @click="copyCode" class="copy-button" :class="{ copied: isCopied }">
            <span v-if="!isCopied">复制</span>
            <span v-else>已复制</span>
          </button>
          <button @click="closeModal" class="close-button">×</button>
        </div>
      </div>
      <div class="code-modal-content">
        <div class="code-block-wrapper" :class="`language-${language}`">
          <pre :class="`language-${language}`"><code v-html="highlightedCode" :class="`language-${language}`"></code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(false)
const isCopied = ref(false)

// 语言映射表
const languageMap = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'py': 'Python',
  'python': 'Python',
  'java': 'Java',
  'cpp': 'C++',
  'c': 'C',
  'css': 'CSS',
  'html': 'HTML',
  'json': 'JSON',
  'xml': 'XML',
  'yaml': 'YAML',
  'yml': 'YAML',
  'md': 'Markdown',
  'markdown': 'Markdown',
  'bash': 'Bash',
  'shell': 'Shell',
  'sh': 'Shell',
  'sql': 'SQL',
  'php': 'PHP',
  'go': 'Go',
  'rust': 'Rust',
  'vue': 'Vue',
  'jsx': 'JSX',
  'tsx': 'TSX'
}

// 显示的语言名称
const displayLanguage = computed(() => {
  return languageMap[props.language.toLowerCase()] || props.language.toUpperCase()
})

// 监听 visible 属性变化
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// 计算高亮代码
const highlightedCode = computed(() => {
  if (!props.code) return ''
  
  // 基本的HTML转义
  let highlighted = props.code
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#39;')
  
  // 应用语法高亮
  return applyHighlighting(highlighted, props.language)
})

// 语法高亮函数
const applyHighlighting = (code, language) => {
  const lang = language.toLowerCase()
  
  // JavaScript/TypeScript 高亮
  if (lang === 'javascript' || lang === 'js' || lang === 'typescript' || lang === 'ts') {
    return code
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|declare|public|private|protected|static|readonly|abstract)\b/g, '<span class="token keyword">$&</span>')
      .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, '<span class="token boolean">$&</span>')
      .replace(/\b\d+(\.\d+)?\b/g, '<span class="token number">$&</span>')
      .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="token string">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="token comment">$&</span>')
      .replace(/\/\/.*$/gm, '<span class="token comment">$&</span>')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="token function">$1</span>(')
  }
  
  // Python 高亮
  else if (lang === 'python' || lang === 'py') {
    return code
      .replace(/\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|lambda|yield|global|nonlocal|assert|break|continue|pass|raise|del|and|or|not|in|is)\b/g, '<span class="token keyword">$&</span>')
      .replace(/\b(True|False|None)\b/g, '<span class="token boolean">$&</span>')
      .replace(/\b\d+(\.\d+)?\b/g, '<span class="token number">$&</span>')
      .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="token string">$&</span>')
      .replace(/#.*$/gm, '<span class="token comment">$&</span>')
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="token function">$1</span>(')
  }
  
  // Java 高亮
  else if (lang === 'java') {
    return code
      .replace(/\b(public|private|protected|static|final|abstract|class|interface|extends|implements|import|package|void|int|long|double|float|boolean|char|String|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|throws|new|this|super|null)\b/g, '<span class="token keyword">$&</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="token boolean">$&</span>')
      .replace(/\b\d+(\.\d+)?[fFdDlL]?\b/g, '<span class="token number">$&</span>')
      .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="token string">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="token comment">$&</span>')
      .replace(/\/\/.*$/gm, '<span class="token comment">$&</span>')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="token function">$1</span>(')
  }
  
  // CSS 高亮
  else if (lang === 'css') {
    return code
      .replace(/([a-zA-Z-]+)\s*:/g, '<span class="token property">$1</span>:')
      .replace(/(#[0-9a-fA-F]{3,6}|\b(?:rgb|rgba|hsl|hsla)\([^)]+\))/g, '<span class="token color">$&</span>')
      .replace(/\b(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|fr))\b/g, '<span class="token number">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="token comment">$&</span>')
      .replace(/([.#]?[a-zA-Z][a-zA-Z0-9-_]*)\s*\{/g, '<span class="token selector">$1</span> {')
  }
  
  // HTML 高亮
  else if (lang === 'html') {
    return code
      .replace(/<(\/?[a-zA-Z][a-zA-Z0-9-]*)/g, '<<span class="token tag">$1</span>')
      .replace(/([a-zA-Z-]+)=("[^&]*"|&#39;[^&#]*&#39;)/g, '<span class="token attr-name">$1</span>=<span class="token attr-value">$2</span>')
      .replace(/<!--[\s\S]*?-->/g, '<span class="token comment">$&</span>')
  }
  
  // JSON 高亮
  else if (lang === 'json') {
    return code
      .replace(/("[^&]*")\s*:/g, '<span class="token property">$1</span>:')
      .replace(/:\s*("[^&]*")/g, ': <span class="token string">$1</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="token boolean">$&</span>')
      .replace(/\b-?\d+(\.\d+)?([eE][+-]?\d+)?\b/g, '<span class="token number">$&</span>')
  }
  
  // Bash/Shell 高亮
  else if (lang === 'bash' || lang === 'shell' || lang === 'sh') {
    return code
      .replace(/\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|break|continue|echo|printf|read|cd|ls|mkdir|rm|cp|mv|grep|sed|awk|sort|uniq|head|tail|cat|less|more)\b/g, '<span class="token keyword">$&</span>')
      .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="token string">$&</span>')
      .replace(/#.*$/gm, '<span class="token comment">$&</span>')
      .replace(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, '<span class="token variable">$&</span>')
  }
  
  return code
}

// 复制代码
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 关闭弹窗
const closeModal = () => {
  isVisible.value = false
  document.body.style.overflow = ''
  emit('close')
}

// ESC 键关闭
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isVisible.value) {
    closeModal()
  }
}

// 监听键盘事件
watch(isVisible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.code-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.code-modal-container {
  background: var(--vp-c-bg);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

.code-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
}

.code-modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-language {
  background: var(--vp-c-brand-1);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.code-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.code-modal-actions {
  display: flex;
  gap: 8px;
}

.copy-button {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.copy-button.copied {
  background: #10b981;
}

.close-button {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.code-modal-content {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.code-block-wrapper {
  position: relative;
}

.code-modal-content pre {
  margin: 0;
  padding: 20px;
  background: var(--vp-code-block-bg);
  color: var(--vp-code-block-color);
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.code-modal-content code {
  background: transparent;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

/* 语法高亮样式 */
:deep(.token.keyword) {
  color: #d73a49;
  font-weight: bold;
}

:deep(.token.string) {
  color: #032f62;
}

:deep(.token.comment) {
  color: #6a737d;
  font-style: italic;
}

:deep(.token.function) {
  color: #6f42c1;
}

:deep(.token.number) {
  color: #005cc5;
}

:deep(.token.boolean) {
  color: #005cc5;
  font-weight: bold;
}

:deep(.token.property) {
  color: #005cc5;
}

:deep(.token.selector) {
  color: #6f42c1;
}

:deep(.token.tag) {
  color: #22863a;
}

:deep(.token.attr-name) {
  color: #6f42c1;
}

:deep(.token.attr-value) {
  color: #032f62;
}

:deep(.token.variable) {
  color: #e36209;
}

:deep(.token.color) {
  color: #005cc5;
}

/* 暗色主题下的语法高亮 */
.dark :deep(.token.keyword) {
  color: #ff7b72;
}

.dark :deep(.token.string) {
  color: #a5d6ff;
}

.dark :deep(.token.comment) {
  color: #8b949e;
}

.dark :deep(.token.function) {
  color: #d2a8ff;
}

.dark :deep(.token.number) {
  color: #79c0ff;
}

.dark :deep(.token.boolean) {
  color: #79c0ff;
}

.dark :deep(.token.property) {
  color: #79c0ff;
}

.dark :deep(.token.selector) {
  color: #d2a8ff;
}

.dark :deep(.token.tag) {
  color: #7ee787;
}

.dark :deep(.token.attr-name) {
  color: #d2a8ff;
}

.dark :deep(.token.attr-value) {
  color: #a5d6ff;
}

.dark :deep(.token.variable) {
  color: #ffa657;
}

.dark :deep(.token.color) {
  color: #79c0ff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-modal-container {
    width: 95vw;
    max-height: 85vh;
  }
  
  .code-modal-header {
    padding: 12px 16px;
  }
  
  .code-modal-content pre {
    padding: 16px;
    font-size: 13px;
  }
}
</style>