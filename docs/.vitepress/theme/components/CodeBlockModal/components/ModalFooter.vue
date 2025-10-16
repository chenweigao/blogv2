<template>
  <div class="code-modal-footer">
    <div class="footer-info">
      <span class="encoding">UTF-8</span>
      <span class="separator">•</span>
      <span class="language">{{ displayLanguage }}</span>
      <span class="separator">•</span>
      <span class="theme">{{ currentTheme }}</span>
    </div>
    <div class="footer-actions">
      <button @click="$emit('download')" class="footer-button u-focus-ring" title="下载代码">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
        <span>下载</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDisplayLanguage } from '../utils.js'

const props = defineProps({
  language: String,
  currentTheme: String
})

defineEmits(['download'])

const displayLanguage = computed(() => getDisplayLanguage(props.language))
</script>

<style scoped>
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
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.footer-button:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.footer-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
  border-radius: 4px;
}

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

@media (hover: hover) {
  .footer-button:hover {
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
  }
}

@media (max-width: 768px) {
  .code-modal-footer {
    padding: 10px 20px;
  }
}
</style>