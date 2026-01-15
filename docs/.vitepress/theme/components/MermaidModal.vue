<template>
  <Teleport to="body">
    <Transition name="mermaid-modal" appear>
      <div 
        v-if="mermaidModalState?.visible?.value" 
        class="mermaid-modal-overlay" 
        @click="closeModal"
      >
        <div class="mermaid-modal-container" @click.stop>
          <!-- 头部工具栏 -->
          <div class="mermaid-modal-header">
            <div class="mermaid-modal-title">
              <svg class="mermaid-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>Mermaid 图表</span>
            </div>
            <div class="mermaid-modal-actions">
              <!-- 缩放控制 -->
              <button 
                class="mermaid-action-btn" 
                @click="zoomOut" 
                title="缩小"
                :disabled="zoomLevel <= 0.1"
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
              <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
              <button 
                class="mermaid-action-btn" 
                @click="zoomIn" 
                title="放大"
                :disabled="zoomLevel >= 5"
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
              <button class="mermaid-action-btn" @click="resetZoom" title="重置缩放 (250%)">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                </svg>
              </button>
              <!-- 下载 SVG -->
              <button class="mermaid-action-btn" @click="downloadSvg" title="下载 SVG">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/>
                </svg>
              </button>
              <!-- 复制 Mermaid 代码 -->
              <button 
                class="mermaid-action-btn" 
                @click="copySource" 
                :title="isCopied ? '已复制!' : '复制 Mermaid 代码'"
                :class="{ 'copied': isCopied }"
              >
                <svg v-if="!isCopied" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </button>
              <!-- 关闭按钮 -->
              <button class="mermaid-action-btn close-btn" @click="closeModal" title="关闭 (Esc)">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 图表内容区域 -->
          <div 
            class="mermaid-modal-content"
            ref="contentRef"
            @wheel="handleWheel"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
          >
            <div 
              class="mermaid-svg-wrapper"
              :style="transformStyle"
              ref="svgWrapperRef"
              v-html="currentSvg"
            ></div>
          </div>

          <!-- 底部提示 -->
          <div class="mermaid-modal-footer">
            <span class="mermaid-hint">
              <kbd>滚轮</kbd> 缩放 · <kbd>拖拽</kbd> 平移 · <kbd>Esc</kbd> 关闭 · <kbd>0</kbd> 重置
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 注入全局的 Mermaid 弹窗状态
const mermaidModalState = inject('mermaidModalState')

// 缩放和平移状态
const zoomLevel = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const lastTranslateX = ref(0)
const lastTranslateY = ref(0)
const isCopied = ref(false)
const initialZoom = ref(1) // 保存初始适配的缩放比例

// refs
const contentRef = ref(null)
const svgWrapperRef = ref(null)

// 计算属性
const currentSvg = computed(() => {
  return mermaidModalState?.data?.value?.svg || ''
})

const currentSource = computed(() => {
  return mermaidModalState?.data?.value?.source || ''
})

const transformStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${zoomLevel.value})`,
  cursor: isDragging.value ? 'grabbing' : 'grab'
}))

// 默认缩放比例
const DEFAULT_ZOOM = 2.5

// 重置为默认缩放
const resetToDefault = () => {
  zoomLevel.value = DEFAULT_ZOOM
  translateX.value = 0
  translateY.value = 0
}

// 缩放方法
const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.25, 5)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.1)
}

// 重置缩放
const resetZoom = () => {
  resetToDefault()
}

// 滚轮缩放
const handleWheel = (event) => {
  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  const newZoom = Math.max(0.1, Math.min(5, zoomLevel.value + delta))
  zoomLevel.value = newZoom
}

// 拖拽平移
const startDrag = (event) => {
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartY.value = event.clientY
  lastTranslateX.value = translateX.value
  lastTranslateY.value = translateY.value
}

const onDrag = (event) => {
  if (!isDragging.value) return
  const deltaX = event.clientX - dragStartX.value
  const deltaY = event.clientY - dragStartY.value
  translateX.value = lastTranslateX.value + deltaX
  translateY.value = lastTranslateY.value + deltaY
}

const endDrag = () => {
  isDragging.value = false
}

// 下载 SVG
const downloadSvg = () => {
  const svg = currentSvg.value
  if (!svg) return
  
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `mermaid-diagram-${Date.now()}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 复制 Mermaid 源码
const copySource = async () => {
  const source = currentSource.value
  if (!source) return
  
  try {
    await navigator.clipboard.writeText(source)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 关闭弹窗
const closeModal = () => {
  if (mermaidModalState) {
    mermaidModalState.visible.value = false
    mermaidModalState.data.value = { svg: '', source: '' }
  }
  // 重置状态
  zoomLevel.value = 1
  translateX.value = 0
  translateY.value = 0
  isCopied.value = false
}

// 键盘事件处理
const handleKeydown = (event) => {
  if (!mermaidModalState?.visible?.value) return
  
  switch (event.key) {
    case 'Escape':
      closeModal()
      break
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
    case '0':
      resetToDefault()
      break
  }
}

// 监听弹窗打开，设置默认缩放
watch(() => mermaidModalState?.visible?.value, (newVal) => {
  if (newVal) {
    nextTick(() => {
      // 设置默认 250% 缩放
      resetToDefault()
    })
  }
})

// 生命周期
onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style>
@import '../styles/mermaid-modal.css';
</style>
