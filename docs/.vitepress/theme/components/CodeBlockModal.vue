<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="isVisible" class="code-modal-overlay" @click="closeModal">
        <div class="code-modal-container" @click.stop>
          <!-- 头部 -->
          <div class="code-modal-header">
            <div class="code-modal-title">
              <div class="language-badge" :style="{ backgroundColor: getLanguageColor(language) }">
                <svg class="language-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 16l4-4-4-4"/>
                  <path d="M6 8l-4 4 4 4"/>
                </svg>
                <span class="language-text">{{ displayLanguage }}</span>
              </div>
              <span class="code-title">代码预览</span>
              <div class="code-stats">
                <span class="lines-count">{{ linesCount }} 行</span>
                <span class="chars-count">{{ charsCount }} 字符</span>
              </div>
            </div>
            <div class="code-modal-actions">
              <button 
                @click="toggleLineNumbers" 
                class="action-button"
                :class="{ active: showLineNumbers }"
                title="切换行号"
              >
                <span class="icon-text">#</span>
              </button>
              <button 
                @click="toggleTheme" 
                class="action-button"
                title="切换主题"
              >
                <span class="icon-text">🎨</span>
              </button>
              <button 
                @click="toggleFullscreen" 
                class="action-button"
                :class="{ active: isFullscreen }"
                title="全屏模式"
              >
                <span class="icon-text">{{ isFullscreen ? '⊟' : '⊞' }}</span>
              </button>
              <button 
                @click="copyCode" 
                class="copy-button" 
                :class="{ copied: isCopied }"
                :title="isCopied ? '已复制' : '复制代码'"
              >
                <span class="icon-text">{{ isCopied ? '✓' : '⧉' }}</span>
                <span class="button-text">{{ isCopied ? '已复制' : '复制' }}</span>
              </button>
              <button @click="closeModal" class="close-button" title="关闭">
                <span class="icon-text">×</span>
              </button>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="code-modal-content" :class="{ fullscreen: isFullscreen }">
            <div class="code-block-wrapper" :class="`language-${language}`">
              <div class="code-container">
                <!-- 行号 -->
                <div v-if="showLineNumbers" class="line-numbers" ref="lineNumbersRef">
                  <div 
                    v-for="n in linesCount" 
                    :key="n" 
                    class="line-number"
                    :class="{ highlighted: highlightedLines.includes(n) }"
                  >
                    {{ n }}
                  </div>
                </div>
                
                <!-- 代码内容 -->
                <div class="code-content" ref="codeContentRef">
                  <div 
                    class="shiki-container"
                    :class="currentTheme"
                    @scroll="syncScroll"
                    v-html="highlightedCode"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部工具栏 -->
          <div class="code-modal-footer">
            <div class="footer-info">
              <span class="encoding">UTF-8</span>
              <span class="separator">•</span>
              <span class="language">{{ displayLanguage }}</span>
              <span class="separator">•</span>
              <span class="theme">{{ currentTheme }}</span>
            </div>
            <div class="footer-actions">
              <button @click="downloadCode" class="footer-button" title="下载代码">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                <span>下载</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { createHighlighter } from 'shiki'

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
  },
  filename: {
    type: String,
    default: ''
  },
  highlightLines: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'fullscreen'])

// 响应式状态
const isVisible = ref(false)
const isCopied = ref(false)
const showLineNumbers = ref(true)
const isFullscreen = ref(false)
const lineNumbersRef = ref(null)
const codeContentRef = ref(null)
const highlighter = ref(null)
const currentTheme = ref('github-light')

// 可用主题
const themes = [
  'github-light',
  'github-dark',
  'monokai',
  'nord',
  'one-dark-pro',
  'dracula',
  'material-theme-palenight',
  'slack-theme-dark-mode'
]

// 语言配置 - 扩展了更多语言
const languageConfig = {
  'js': { name: 'JavaScript', color: '#f7df1e', icon: '🟨' },
  'javascript': { name: 'JavaScript', color: '#f7df1e', icon: '🟨' },
  'ts': { name: 'TypeScript', color: '#3178c6', icon: '🔷' },
  'typescript': { name: 'TypeScript', color: '#3178c6', icon: '🔷' },
  'py': { name: 'Python', color: '#3776ab', icon: '🐍' },
  'python': { name: 'Python', color: '#3776ab', icon: '🐍' },
  'java': { name: 'Java', color: '#ed8b00', icon: '☕' },
  'cpp': { name: 'C++', color: '#00599c', icon: '⚡' },
  'c': { name: 'C', color: '#a8b9cc', icon: '🔧' },
  'css': { name: 'CSS', color: '#1572b6', icon: '🎨' },
  'html': { name: 'HTML', color: '#e34f26', icon: '🌐' },
  'json': { name: 'JSON', color: '#000000', icon: '📋' },
  'xml': { name: 'XML', color: '#ff6600', icon: '📄' },
  'yaml': { name: 'YAML', color: '#cb171e', icon: '⚙️' },
  'yml': { name: 'YAML', color: '#cb171e', icon: '⚙️' },
  'md': { name: 'Markdown', color: '#083fa1', icon: '📝' },
  'markdown': { name: 'Markdown', color: '#083fa1', icon: '📝' },
  'bash': { name: 'Bash', color: '#4eaa25', icon: '💻' },
  'shell': { name: 'Shell', color: '#89e051', icon: '🐚' },
  'sh': { name: 'Shell', color: '#89e051', icon: '🐚' },
  'sql': { name: 'SQL', color: '#336791', icon: '🗄️' },
  'php': { name: 'PHP', color: '#777bb4', icon: '🐘' },
  'go': { name: 'Go', color: '#00add8', icon: 'hamster' },
  'rust': { name: 'Rust', color: '#ce422b', icon: '🦀' },
  'vue': { name: 'Vue', color: '#4fc08d', icon: '💚' },
  'jsx': { name: 'JSX', color: '#61dafb', icon: '⚛️' },
  'tsx': { name: 'TSX', color: '#61dafb', icon: '⚛️' },
  'swift': { name: 'Swift', color: '#fa7343', icon: '🦉' },
  'kotlin': { name: 'Kotlin', color: '#7f52ff', icon: '🎯' },
  'dart': { name: 'Dart', color: '#0175c2', icon: '🎯' },
  'ruby': { name: 'Ruby', color: '#cc342d', icon: '💎' },
  'scala': { name: 'Scala', color: '#dc322f', icon: '⚖️' },
  'r': { name: 'R', color: '#276dc3', icon: '📊' },
  'matlab': { name: 'MATLAB', color: '#e16737', icon: '🔬' },
  'powershell': { name: 'PowerShell', color: '#012456', icon: '💙' },
  'dockerfile': { name: 'Dockerfile', color: '#384d54', icon: '🐳' },
  'nginx': { name: 'Nginx', color: '#009639', icon: '🌐' },
  'apache': { name: 'Apache', color: '#d22128', icon: '🪶' }
}

// 计算属性
const displayLanguage = computed(() => {
  const config = languageConfig[props.language.toLowerCase()]
  return config ? config.name : props.language.toUpperCase()
})

const getLanguageColor = (lang) => {
  const config = languageConfig[lang.toLowerCase()]
  return config ? config.color : '#666666'
}

const linesCount = computed(() => {
  return props.code ? props.code.split('\n').length : 0
})

const charsCount = computed(() => {
  return props.code ? props.code.length : 0
})

const highlightedLines = computed(() => {
  return props.highlightLines || []
})

// 使用 Shiki 进行语法高亮
const highlightedCode = computed(() => {
  if (!props.code || !highlighter.value) {
    return `<pre><code>${escapeHtml(props.code)}</code></pre>`
  }
  
  try {
    const html = highlighter.value.codeToHtml(props.code, {
      lang: props.language,
      theme: currentTheme.value,
      transformers: [
        // 添加行高亮支持
        {
          line(node, line) {
            if (highlightedLines.value.includes(line)) {
              node.properties.class = (node.properties.class || '') + ' highlighted-line'
            }
          }
        }
      ]
    })
    return html
  } catch (error) {
    console.warn('Shiki highlighting failed:', error)
    return `<pre><code>${escapeHtml(props.code)}</code></pre>`
  }
})

// 初始化 Shiki 高亮器
const initHighlighter = async () => {
  try {
    highlighter.value = await createHighlighter({
      themes: themes,
      langs: [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
        'css', 'html', 'json', 'xml', 'yaml', 'markdown',
        'bash', 'shell', 'sql', 'php', 'go', 'rust',
        'vue', 'jsx', 'tsx', 'swift', 'kotlin', 'dart',
        'ruby', 'scala', 'r', 'matlab', 'powershell',
        'dockerfile', 'nginx', 'apache'
      ]
    })
  } catch (error) {
    console.error('Failed to initialize Shiki highlighter:', error)
  }
}

// 工具函数
const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// 切换行号显示
const toggleLineNumbers = () => {
  showLineNumbers.value = !showLineNumbers.value
  nextTick(() => {
    syncScroll()
  })
}

// 切换主题
const toggleTheme = () => {
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  currentTheme.value = themes[nextIndex]
}

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen', isFullscreen.value)
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
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = props.code
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch (fallbackErr) {
      console.error('降级复制也失败:', fallbackErr)
    }
    document.body.removeChild(textArea)
  }
}

// 下载代码
const downloadCode = () => {
  const blob = new Blob([props.code], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.filename || `code.${props.language}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 关闭模态框
const closeModal = () => {
  isVisible.value = false
  emit('close')
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

// 键盘事件处理
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    closeModal()
  } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    copyCode()
  } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    toggleFullscreen()
  } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    toggleLineNumbers()
  }
}

// 监听 props 变化
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    nextTick(() => {
      syncScroll()
    })
  }
})

// 生命周期
onMounted(async () => {
  await initHighlighter()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 基础样式 */
.icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: block;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon-text {
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.language-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: block;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .code-modal-container,
.modal-leave-to .code-modal-container {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

/* 遮罩层 */
.code-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  padding: 20px;
}

/* 模态框容器 */
.code-modal-container {
  background: var(--vp-c-bg);
  border-radius: 16px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  max-width: min(90vw, 1200px);
  max-height: min(90vh, 800px);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 头部 */
.code-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  backdrop-filter: blur(10px);
}

.code-modal-title {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.language-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.code-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 16px;
}

.code-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.code-modal-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-button {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.action-button:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.action-button.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.copy-button {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-width: 80px;
  justify-content: center;
}

.copy-button:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1), 0.3);
}

.copy-button.copied {
  background: #10b981;
}

.button-text {
  font-size: 13px;
}

.close-button {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

/* 内容区域 */
.code-modal-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.code-modal-content.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background: var(--vp-c-bg);
}

.code-block-wrapper {
  height: 100%;
  position: relative;
}

.code-container {
  display: flex;
  height: 100%;
}

.line-numbers {
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-border);
  padding: 20px 0;
  min-width: 60px;
  overflow: hidden;
  user-select: none;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.5;
}

.line-number {
  padding: 0 16px;
  color: var(--vp-c-text-3);
  text-align: right;
  transition: color 0.2s ease;
}

.line-number.highlighted {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.code-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

.shiki-container {
  min-height: 100%;
  overflow: auto;
}

/* Shiki 样式覆盖 */
:deep(.shiki) {
  margin: 0;
  padding: 20px 24px;
  background: transparent !important;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  min-height: 100%;
}

:deep(.shiki code) {
  background: transparent;
  padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: pre;
}

:deep(.highlighted-line) {
  background: var(--vp-c-brand-soft);
  display: block;
  margin: 0 -24px;
  padding: 0 24px;
  border-left: 3px solid var(--vp-c-brand-1);
}

/* 底部工具栏 */
.code-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-3);
}

.separator {
  color: var(--vp-c-text-3);
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.footer-button {
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.footer-button:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-modal-overlay {
    padding: 10px;
  }
  
  .code-modal-container {
    max-width: 100%;
    max-height: 100%;
    border-radius: 12px;
  }
  
  .code-modal-header {
    padding: 16px 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .code-modal-title {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .code-stats {
    display: none;
  }
  
  .code-modal-actions {
    gap: 6px;
  }
  
  .action-button {
    width: 32px;
    height: 32px;
  }
  
  .copy-button {
    padding: 6px 12px;
    min-width: 70px;
  }
  
  .button-text {
    display: none;
  }
  
  .line-numbers {
    min-width: 50px;
    padding: 16px 0;
  }
  
  .line-number {
    padding: 0 12px;
  }
  
  :deep(.shiki) {
    padding: 16px 20px;
    font-size: 13px;
  }
  
  .code-modal-footer {
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .language-badge {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .code-title {
    font-size: 14px;
  }
  
  .copy-button .button-text {
    display: none;
  }
  
  .line-numbers {
    min-width: 40px;
  }
  
  .line-number {
    padding: 0 8px;
    font-size: 12px;
  }
  
  :deep(.shiki) {
    padding: 16px;
    font-size: 12px;
  }
}

/* 滚动条样式 */
.shiki-container::-webkit-scrollbar,
.line-numbers::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.shiki-container::-webkit-scrollbar-track,
.line-numbers::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
}

.shiki-container::-webkit-scrollbar-thumb,
.line-numbers::-webkit-scrollbar-thumb {
  background: var(--vp-c-text-3);
  border-radius: 4px;
}

.shiki-container::-webkit-scrollbar-thumb:hover,
.line-numbers::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-2);
}
</style>