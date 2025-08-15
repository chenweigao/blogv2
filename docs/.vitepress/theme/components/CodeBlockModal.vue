## Here's my code: 
<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="isVisible" class="code-modal-overlay" @click="closeModal">
        <div class="code-modal-container" @click.stop>
          <!-- 头部 -->
          <ModalHeader
            :language="language"
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
            :language="language"
            :current-theme="currentTheme"
            @download="downloadCode"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, nextTick } from 'vue'
import ModalHeader from './CodeBlockModal/components/ModalHeader.vue'
import ModalFooter from './CodeBlockModal/components/ModalFooter.vue'
import { useShiki } from './CodeBlockModal/composables/useShiki.js'
import { useModal } from './CodeBlockModal/composables/useModal.js'
import { useCodeActions } from './CodeBlockModal/composables/useCodeActions.js'

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

// 使用 composables
const { currentTheme, isLoading, initHighlighter, getHighlightedCode, toggleTheme } = useShiki()
const { isVisible, isFullscreen, closeModal, toggleFullscreen } = useModal(props, emit)
const { 
  isCopied, 
  showLineNumbers, 
  lineNumbersRef, 
  codeContentRef, 
  toggleLineNumbers, 
  copyCode, 
  downloadCode, 
  syncScroll 
} = useCodeActions(props)

// 计算属性
const linesCount = computed(() => {
  return props.code ? props.code.split('\n').length : 0
})

const charsCount = computed(() => {
  return props.code ? props.code.length : 0
})

const highlightedLines = computed(() => {
  return props.highlightLines || []
})

const highlightedCode = computed(() => {
  return getHighlightedCode(props.code, props.language, highlightedLines.value)
})

// 监听 props 变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      syncScroll()
    })
  }
})

// 生命周期
onMounted(async () => {
  await initHighlighter()
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