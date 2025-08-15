<template>
  <div class="git-history-button-container">
    <button 
      class="git-history-button"
      @click="openHistoryModal"
      :title="buttonTitle"
    >
      <div class="button-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6"></path>
          <path d="m21 12-6-6m-6 6-6-6"></path>
          <path d="m21 12-6 6m-6-6-6 6"></path>
        </svg>
      </div>
      <span class="button-text">历史记录</span>
      <div class="button-ripple"></div>
    </button>
    
    <GitHistoryModal 
      :visible="modalVisible"
      :doc-path="currentDocPath"
      @close="closeHistoryModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import GitHistoryModal from './GitHistoryModal.vue'

const { page } = useData()
const modalVisible = ref(false)

// 获取当前文档路径
const currentDocPath = computed(() => {
  if (!page.value.relativePath) return ''
  
  // 移除 .md 扩展名并添加前导斜杠
  const path = '/' + page.value.relativePath.replace(/\.md$/, '')
  return path
})

const buttonTitle = computed(() => {
  return `查看 ${currentDocPath.value} 的历史记录`
})

function openHistoryModal() {
  modalVisible.value = true
}

function closeHistoryModal() {
  modalVisible.value = false
}
</script>

<style scoped>
.git-history-button-container {
  display: inline-block;
  position: relative;
}

.git-history-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  user-select: none;
}

.git-history-button:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.git-history-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.button-icon svg {
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease;
}

.git-history-button:hover .button-icon svg {
  transform: rotate(180deg);
}

.button-text {
  font-weight: 500;
  white-space: nowrap;
}

.button-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
  pointer-events: none;
}

.git-history-button:active .button-ripple {
  width: 100px;
  height: 100px;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .git-history-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .button-text {
    display: none;
  }
  
  .button-icon {
    width: 18px;
    height: 18px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .git-history-button:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}
</style>