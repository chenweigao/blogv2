## Here's my code: 
<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="codeModalState?.visible?.value" class="code-modal-overlay" @click="closeModal">
        <div class="code-modal-container" @click.stop>
          <!-- 头部 -->
          <ModalHeader
            :language="currentLanguage"
            :lines-count="linesCount"
            :chars-count="charsCount"
            :show-line-numbers="showLineNumbers"
            :is-fullscreen="isFullscreen"
            :is-copied="isCopied"
            @toggle-line-numbers="toggleLineNumbers"
            @toggle-theme="toggleTheme"
            @toggle-fullscreen="toggleFullscreen"
            @copy-code="copyCode"
            @close="closeModal"
          />

          <!-- 内容区域 -->
          <div class="code-modal-content" :class="{ fullscreen: isFullscreen }">
            <div class="code-block-wrapper" :class="`language-${currentLanguage}`">
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
                  <!-- 加载状态 -->
                  <div v-if="isLoading" class="loading-container">
                    <div class="loading-spinner"></div>
                    <span>正在加载语法高亮...</span>
                  </div>
                  <!-- 代码显示 -->
                  <div 
                    v-else
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
          <ModalFooter
            :language="currentLanguage"
            :current-theme="currentTheme"
            @download="downloadCode"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, nextTick, inject, onUnmounted } from 'vue'
import ModalHeader from './CodeBlockModal/components/ModalHeader.vue'
import ModalFooter from './CodeBlockModal/components/ModalFooter.vue'
import { useShiki } from './CodeBlockModal/composables/useShiki.js'
import { useCodeActions } from './CodeBlockModal/composables/useCodeActions.js'

// 注入全局的代码块弹窗状态
const codeModalState = inject('codeModalState')

// 添加调试信息（仅开发）
if (import.meta.env.DEV) {
  console.log('[CodeBlockModal] 组件初始化')
  console.log('[CodeBlockModal] 注入的全局状态:', codeModalState)
}

// 使用 composables
const { currentTheme, isLoading, initHighlighter, getHighlightedCode, toggleTheme } = useShiki()

// 计算属性
const currentCode = computed(() => {
  const code = codeModalState?.data?.value?.code || ''
  console.log('[CodeBlockModal] 当前代码长度:', code.length)
  return code
})

const currentLanguage = computed(() => {
  const language = codeModalState?.data?.value?.language || 'text'
  console.log('[CodeBlockModal] 当前语言:', language)
  return language
})

const linesCount = computed(() => {
  return currentCode.value ? currentCode.value.split('\n').length : 0
})

const charsCount = computed(() => {
  return currentCode.value ? currentCode.value.length : 0
})

const highlightedLines = computed(() => {
  return [] // 可以后续扩展支持行高亮
})

const highlightedCode = computed(() => {
  return getHighlightedCode(currentCode.value, currentLanguage.value, highlightedLines.value)
})

const isFullscreen = computed(() => false) // 简化实现，可以后续扩展

// 使用 useCodeActions，传入响应式的 props 对象
const codeActionsProps = computed(() => ({
  code: currentCode.value,
  language: currentLanguage.value,
  filename: `code.${currentLanguage.value}`
}))

const { 
  isCopied, 
  showLineNumbers, 
  lineNumbersRef, 
  codeContentRef, 
  toggleLineNumbers, 
  copyCode, 
  downloadCode, 
  syncScroll 
} = useCodeActions(codeActionsProps)

// 关闭模态框
const closeModal = () => {
  console.log('[CodeBlockModal] 关闭弹窗')
  if (codeModalState) {
    codeModalState.visible.value = false
    codeModalState.data.value = { code: '', language: 'text' }
  }
}

// 切换全屏（简化实现）
const toggleFullscreen = () => {
  console.log('[CodeBlockModal] 切换全屏')
}

// 监听全局状态变化
watch(() => codeModalState?.visible?.value, (newVal) => {
  console.log('[CodeBlockModal] 全局状态变化:', newVal)
  if (newVal) {
    nextTick(() => {
      syncScroll()
    })
  }
}, { immediate: true })

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.key === 'Escape' && codeModalState?.visible?.value) {
    closeModal()
  }
}

// 在挂载时注册，卸载时移除
onMounted(async () => {
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', handleKeydown)
  }
  await initHighlighter()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style>
@import './CodeBlockModal/styles/modal.css';
@import './CodeBlockModal/styles/code.css';

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  gap: 16px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-border);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>