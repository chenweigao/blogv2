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
const { currentTheme, initHighlighter, getHighlightedCode, toggleTheme } = useShiki()
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
</style>