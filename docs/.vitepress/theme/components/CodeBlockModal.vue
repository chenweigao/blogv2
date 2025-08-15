<template>
  <div v-if="isVisible" class="code-modal-overlay" @click="closeModal">
    <div class="code-modal-container" @click.stop>
      <div class="code-modal-header">
        <div class="code-modal-title">
          <span class="code-language">{{ language }}</span>
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
        <pre><code v-html="highlightedCode"></code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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
  // 这里可以集成代码高亮库，暂时返回原始代码
  return props.code.replace(/</g, '<').replace(/>/g, '>')
})

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