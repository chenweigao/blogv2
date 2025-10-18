<template>
  <Teleport to="body">
    <div 
      v-if="isVisible" 
      class="git-history-modal-overlay"
      @click="closeModal"
    >
      <div 
        class="git-history-modal"
        @click.stop
      >
        <!-- 模态框头部 -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="m21 12-6-6m-6 6-6-6"></path>
                <path d="m21 12-6 6m-6-6-6 6"></path>
              </svg>
            </div>
            <div class="header-text">
              <h3 class="modal-title">📝 文档历史记录</h3>
              <p class="modal-subtitle" v-if="historyData">
                {{ historyData.filePath }} · {{ historyData.totalCommits }} 次提交
              </p>
            </div>
          </div>
          <button 
            class="close-button"
            @click="closeModal"
            aria-label="关闭"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 模态框内容 -->
        <div class="modal-body">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在加载历史记录...</p>
          </div>

          <div v-else-if="error" class="error-state">
            <div class="error-icon">⚠️</div>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="historyData && historyData.history.length > 0" class="history-list">
            <div 
              v-for="(commit, index) in historyData.history" 
              :key="commit.hash"
              class="history-item"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="commit-timeline">
                <div class="timeline-dot"></div>
                <div v-if="index < historyData.history.length - 1" class="timeline-line"></div>
              </div>
              
              <div class="commit-content">
                <div class="commit-header">
                  <div class="commit-message">{{ commit.subject }}</div>
                  <div class="commit-hash">
                    <code>{{ commit.hash }}</code>
                  </div>
                </div>
                
                <div class="commit-meta">
                  <div class="commit-author">
                    <svg class="author-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {{ commit.author }}
                  </div>
                  
                  <div class="commit-date">
                    <svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {{ formatDate(commit.date) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">📄</div>
            <p>暂无历史记录</p>
            <small>该文档可能是新创建的或未被 Git 跟踪</small>
          </div>
        </div>

        <!-- 模态框底部 -->
        <div class="modal-footer">
          <div class="footer-info">
            <small>最后更新: {{ historyData?.lastUpdated ? formatDate(historyData.lastUpdated) : '未知' }}</small>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  docPath: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(false)
const loading = ref(false)
const error = ref('')
const historyData = ref(null)

// 监听 visible 属性变化
watch(() => props.visible, (newValue) => {
  if (newValue) {
    openModal()
  } else {
    closeModal()
  }
})

// 监听文档路径变化
watch(() => props.docPath, (newPath) => {
  if (newPath && isVisible.value) {
    loadHistoryData()
  }
})

// 键盘事件处理
function handleKeydown(event) {
  if (event.key === 'Escape' && isVisible.value) {
    closeModal()
  }
}

// 在打开时绑定键盘事件，关闭时解绑
async function openModal() {
  isVisible.value = true
  document.body.style.overflow = 'hidden'
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', handleKeydown)
  }
  await nextTick()
  if (props.docPath) {
    await loadHistoryData()
  }
}

function closeModal() {
  isVisible.value = false
  document.body.style.overflow = ''
  if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
  }
  emit('close')
}

// 卸载时确保移除监听
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
  }
})

async function loadHistoryData() {
  if (!props.docPath) return
  
  loading.value = true
  error.value = ''
  historyData.value = null
  
  try {
    // 优先尝试实时获取（开发模式）
    if (import.meta.env.DEV) {
      try {
        const filePath = props.docPath.replace(/^\//, '') + '.md'
        const response = await fetch(`/api/git-history?file=${encodeURIComponent(filePath)}&max=10`)
        
        if (response.ok) {
          const realtimeData = await response.json()
          historyData.value = realtimeData
          console.log('✅ 使用实时 Git 历史记录')
          return
        }
      } catch (realtimeError) {
        console.warn('实时获取失败，回退到静态数据:', realtimeError.message)
      }
    }
    
    // 回退到预生成的静态数据
    const response = await fetch('/.vitepress/data/git-history.json')
    if (response.ok) {
      const allHistoryData = await response.json()
      const docHistory = allHistoryData[props.docPath]
      
      if (docHistory) {
        historyData.value = docHistory
        console.log('📄 使用预生成的静态数据')
      } else {
        error.value = '未找到该文档的历史记录'
      }
    } else {
      error.value = '无法加载历史记录数据'
    }
  } catch (err) {
    console.error('Failed to load git history:', err)
    error.value = '加载历史记录时出错'
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return '未知'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.git-history-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: overlayFadeIn 0.3s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.git-history-modal {
  background: var(--vp-c-bg);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
  border: 1px solid var(--vp-c-divider);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 头部样式 */
.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--vp-c-bg-alt);
  border-radius: 12px 12px 0 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-icon svg {
  width: 20px;
  height: 20px;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.close-button {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.close-button svg {
  width: 16px;
  height: 16px;
}

/* 内容样式 */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* 历史记录列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.history-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  animation: itemFadeIn 0.5s ease-out both;
}

@keyframes itemFadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.commit-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 0.25rem;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.timeline-line {
  width: 2px;
  height: 100%;
  background: var(--vp-c-divider);
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
}

.commit-content {
  flex: 1;
  min-width: 0;
}

.commit-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.commit-message {
  font-weight: 500;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  flex: 1;
}

.commit-hash {
  flex-shrink: 0;
}

.commit-hash code {
  background: var(--vp-c-bg-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.commit-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.commit-author,
.commit-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-icon,
.date-icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

/* 底部样式 */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  border-radius: 0 0 12px 12px;
}

.footer-info {
  text-align: center;
  color: var(--vp-c-text-2);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .git-history-modal {
    width: 95vw;
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .commit-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .commit-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>