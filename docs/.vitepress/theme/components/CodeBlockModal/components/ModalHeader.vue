<template>
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
        @click="$emit('toggle-line-numbers')" 
        class="action-button u-focus-ring"
        :class="{ active: showLineNumbers }"
        title="切换行号"
      >
        <span class="icon-text">#</span>
      </button>
      <button 
        @click="$emit('toggle-theme')" 
        class="action-button u-focus-ring"
        title="切换主题"
      >
        <span class="icon-text">🎨</span>
      </button>
      <button 
        @click="$emit('toggle-fullscreen')" 
        class="action-button u-focus-ring"
        :class="{ active: isFullscreen }"
        title="全屏模式"
      >
        <span class="icon-text">{{ isFullscreen ? '⊟' : '⊞' }}</span>
      </button>
      <button 
        @click="$emit('copy-code')" 
        class="copy-button u-focus-ring" 
        :class="{ copied: isCopied }"
        :title="isCopied ? '已复制' : '复制代码'"
      >
        <span class="icon-text">{{ isCopied ? '✓' : '⧉' }}</span>
        <span class="button-text">{{ isCopied ? '已复制' : '复制' }}</span>
      </button>
      <button @click="$emit('close')" class="close-button u-focus-ring" title="关闭">
        <span class="icon-text">×</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDisplayLanguage, getLanguageColor } from '../utils.js'

const props = defineProps({
  language: String,
  linesCount: Number,
  charsCount: Number,
  showLineNumbers: Boolean,
  isFullscreen: Boolean,
  isCopied: Boolean
})

defineEmits(['toggle-line-numbers', 'toggle-theme', 'toggle-fullscreen', 'copy-code', 'close'])

const displayLanguage = computed(() => getDisplayLanguage(props.language))
</script>

<style scoped>
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
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
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
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
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
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.close-button:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
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

.button-text {
  font-size: 13px;
}

/* 统一焦点可见性 */
.action-button:focus-visible,
.copy-button:focus-visible,
.close-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
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
}

/* 为所有 hover 添加媒体门控 */
@media (hover: hover) {
  .action-button:hover {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-brand-1);
    transform: translateY(-1px);
  }
  .copy-button:hover {
    background: var(--vp-c-brand-2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1), 0.3);
  }
  .close-button:hover {
    background: #fee2e2;
    color: #dc2626;
    border-color: #fecaca;
  }
}

/* 透明度与强制颜色降级，提升可访问性 */
@media (prefers-reduced-transparency: reduce) {
  .code-modal-header {
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
    background: var(--vp-c-bg-alt) !important;
    box-shadow: var(--vp-shadow-1) !important;
  }
}
@media (forced-colors: active) {
  .code-modal-header,
  .action-button,
  .copy-button,
  .close-button {
    background: Canvas !important;
    color: CanvasText !important;
    border-color: CanvasText !important;
    outline: 2px solid CanvasText !important;
    outline-offset: 2px !important;
    box-shadow: none !important;
  }
}
</style>