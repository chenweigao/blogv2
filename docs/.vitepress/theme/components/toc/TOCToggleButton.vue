<template>
  <div class="toc-toggle-wrapper">
    <!-- 主要的进度环按钮 -->
    <button
      class="toc-progress-button"
      :class="{ 
        'is-active': isActive, 
        'is-dragging': isDragging,
        'is-draggable': isDraggable,
        'has-progress': showProgress && readingProgress > 0
      }"
      @click="handleClick"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
      :title="`${isActive ? 'Hide' : 'Show'} TOC - ${Math.round(readingProgress)}% read`"
      :aria-label="`${isActive ? 'Hide' : 'Show'} table of contents - ${Math.round(readingProgress)}% read`"
      :aria-expanded="isActive"
      :style="buttonStyle"
    >
      <!-- 背景进度环 -->
      <svg class="progress-ring-svg" :width="ringSize" :height="ringSize">
        <!-- 背景环 -->
        <circle
          class="progress-ring-bg"
          :cx="ringSize / 2"
          :cy="ringSize / 2"
          :r="ringRadius"
          fill="transparent"
          :stroke-width="ringStrokeWidth"
        />
        <!-- 进度环 -->
        <circle
          class="progress-ring-fill"
          :cx="ringSize / 2"
          :cy="ringSize / 2"
          :r="ringRadius"
          fill="transparent"
          :stroke-width="ringStrokeWidth"
          :stroke-dasharray="ringCircumference"
          :stroke-dashoffset="ringOffset"
        />
      </svg>
      
      <!-- 中心内容区域 -->
      <div class="button-content">
        <!-- TOC 图标 -->
        <svg class="toc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
        </svg>
        
        <!-- 进度百分比文字（小字体，在图标下方） -->
        <div class="progress-percentage" v-if="showProgress && readingProgress > 0">
          {{ Math.round(readingProgress) }}%
        </div>
      </div>
      
      <!-- 标题数量徽章 -->
      <span class="toc-badge" v-if="headingCount > 0">{{ headingCount }}</span>
      
      <!-- 拖拽手柄 -->
      <div 
        class="drag-handle" 
        v-if="isDraggable"
        @mousedown.stop="handleDragStart"
        @touchstart.stop="handleDragTouchStart"
        :title="'Drag to move'"
      >
        <svg viewBox="0 0 24 24" width="10" height="10">
          <path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"/>
        </svg>
      </div>
      
      <!-- 拖拽预览 -->
      <div class="drag-preview" v-if="isDragging"></div>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  headingCount: {
    type: Number,
    default: 0
  },
  isDraggable: {
    type: Boolean,
    default: true
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  readingProgress: {
    type: Number,
    default: 0
  },
  showProgress: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'drag-start', 'drag-move', 'drag-end'])

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const currentPosition = ref({ ...props.position })
const dragStartTime = ref(0)
const dragThreshold = 5

// 进度环计算 - 更大的环形设计
const ringSize = computed(() => 56)
const ringStrokeWidth = computed(() => 4)
const ringRadius = computed(() => (ringSize.value - ringStrokeWidth.value * 2) / 2)
const ringCircumference = computed(() => 2 * Math.PI * ringRadius.value)
const ringOffset = computed(() => {
  const progress = Math.max(0, Math.min(100, props.readingProgress))
  return ringCircumference.value - (progress / 100) * ringCircumference.value
})

const buttonStyle = computed(() => ({
  transform: `translate(${currentPosition.value.x}px, ${currentPosition.value.y}px)`,
  transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: isDragging.value ? 1000 : 100
}))

const handleClick = (event) => {
  const dragDuration = Date.now() - dragStartTime.value
  const dragDistance = Math.sqrt(
    Math.pow(event.clientX - dragStart.value.x, 2) + 
    Math.pow(event.clientY - dragStart.value.y, 2)
  )
  
  if (!isDragging.value && (dragDuration < 200 || dragDistance < dragThreshold)) {
    emit('click', event)
  }
}

const handleMouseDown = (event) => {
  if (!props.isDraggable) return
  
  dragStartTime.value = Date.now()
  dragStart.value = { x: event.clientX, y: event.clientY }
  
  document.addEventListener('mousemove', handleMouseMoveCheck)
  document.addEventListener('mouseup', handleMouseUpCheck)
}

const handleMouseMoveCheck = (event) => {
  const distance = Math.sqrt(
    Math.pow(event.clientX - dragStart.value.x, 2) + 
    Math.pow(event.clientY - dragStart.value.y, 2)
  )
  
  if (distance > dragThreshold && !isDragging.value) {
    startDrag(event.clientX, event.clientY)
    document.removeEventListener('mousemove', handleMouseMoveCheck)
    document.removeEventListener('mouseup', handleMouseUpCheck)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}

const handleMouseUpCheck = () => {
  document.removeEventListener('mousemove', handleMouseMoveCheck)
  document.removeEventListener('mouseup', handleMouseUpCheck)
}

const handleTouchStart = (event) => {
  if (!props.isDraggable) return
  
  const touch = event.touches[0]
  dragStartTime.value = Date.now()
  dragStart.value = { x: touch.clientX, y: touch.clientY }
  
  document.addEventListener('touchmove', handleTouchMoveCheck, { passive: false })
  document.addEventListener('touchend', handleTouchEndCheck)
}

const handleTouchMoveCheck = (event) => {
  const touch = event.touches[0]
  const distance = Math.sqrt(
    Math.pow(touch.clientX - dragStart.value.x, 2) + 
    Math.pow(touch.clientY - dragStart.value.y, 2)
  )
  
  if (distance > dragThreshold && !isDragging.value) {
    event.preventDefault()
    startDrag(touch.clientX, touch.clientY)
    document.removeEventListener('touchmove', handleTouchMoveCheck)
    document.removeEventListener('touchend', handleTouchEndCheck)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }
}

const handleTouchEndCheck = () => {
  document.removeEventListener('touchmove', handleTouchMoveCheck)
  document.removeEventListener('touchend', handleTouchEndCheck)
}

const handleDragStart = (event) => {
  event.preventDefault()
  startDrag(event.clientX, event.clientY)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleDragTouchStart = (event) => {
  event.preventDefault()
  const touch = event.touches[0]
  startDrag(touch.clientX, touch.clientY)
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
}

const startDrag = (clientX, clientY) => {
  isDragging.value = true
  dragStart.value = {
    x: clientX - currentPosition.value.x,
    y: clientY - currentPosition.value.y
  }
  
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'grabbing'
  
  emit('drag-start', { x: currentPosition.value.x, y: currentPosition.value.y })
}

const handleMouseMove = (event) => {
  if (!isDragging.value) return
  event.preventDefault()
  updatePosition(event.clientX, event.clientY)
}

const handleTouchMove = (event) => {
  if (!isDragging.value) return
  event.preventDefault()
  const touch = event.touches[0]
  updatePosition(touch.clientX, touch.clientY)
}

const updatePosition = (clientX, clientY) => {
  const newX = clientX - dragStart.value.x
  const newY = clientY - dragStart.value.y
  
  const buttonSize = ringSize.value
  const margin = 10
  
  const maxX = window.innerWidth - buttonSize - margin
  const maxY = window.innerHeight - buttonSize - margin
  
  currentPosition.value = {
    x: Math.max(margin, Math.min(newX, maxX)),
    y: Math.max(margin, Math.min(newY, maxY))
  }
  
  emit('drag-move', { ...currentPosition.value })
}

const handleMouseUp = () => {
  endDrag()
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const handleTouchEnd = () => {
  endDrag()
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
}

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    
    nextTick(() => {
      emit('drag-end', { ...currentPosition.value })
    })
  }
}

const setPosition = (newPosition) => {
  currentPosition.value = { ...newPosition }
}

const resetPosition = () => {
  currentPosition.value = { x: 0, y: 0 }
}

defineExpose({
  updatePosition: setPosition,
  resetPosition
})

onMounted(() => {
  currentPosition.value = { ...props.position }
})

onUnmounted(() => {
  // 清理所有事件监听器
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('mousemove', handleMouseMoveCheck)
  document.removeEventListener('mouseup', handleMouseUpCheck)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchmove', handleTouchMoveCheck)
  document.removeEventListener('touchend', handleTouchEndCheck)
  
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
})
</script>

<style scoped>
.toc-toggle-wrapper {
  position: relative;
  display: inline-block;
}

.toc-progress-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--vp-c-bg);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  user-select: none;
  touch-action: none;
  overflow: visible;
}

.toc-progress-button:hover {
  background: var(--vp-c-bg-soft);
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.toc-progress-button.is-active {
  background: var(--vp-c-brand-soft);
  box-shadow: 0 6px 24px rgba(var(--vp-c-brand-rgb), 0.3);
}

.toc-progress-button.is-dragging {
  cursor: grabbing;
  z-index: 1000;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
  transform: scale(1.1);
}

.progress-ring-svg {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
  pointer-events: none;
}

.progress-ring-bg {
  stroke: var(--vp-c-divider);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.progress-ring-fill {
  stroke: var(--vp-c-brand-1);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease;
  filter: drop-shadow(0 0 4px rgba(var(--vp-c-brand-rgb), 0.3));
}

.toc-progress-button.is-active .progress-ring-fill {
  stroke: var(--vp-c-brand-2);
  filter: drop-shadow(0 0 8px rgba(var(--vp-c-brand-rgb), 0.5));
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
}

.toc-icon {
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
  margin-bottom: 2px;
}

.toc-progress-button:hover .toc-icon {
  color: var(--vp-c-brand-1);
}

.toc-progress-button.is-active .toc-icon {
  color: var(--vp-c-brand-1);
  transform: rotate(180deg);
}

.progress-percentage {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  line-height: 1;
  margin-top: -2px;
}

.toc-progress-button:hover .progress-percentage {
  color: var(--vp-c-brand-1);
}

.toc-progress-button.is-active .progress-percentage {
  color: var(--vp-c-brand-1);
}

.toc-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.toc-progress-button.is-active .toc-badge {
  background: var(--vp-c-brand-2);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.drag-handle {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: grab;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 3;
}

.toc-progress-button:hover .drag-handle {
  opacity: 1;
  transform: scale(1.1);
}

.drag-handle:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}

.drag-handle:active {
  cursor: grabbing;
  transform: scale(0.9);
}

.drag-handle svg {
  opacity: 0.7;
}

.drag-preview {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px dashed var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0.6;
  pointer-events: none;
  animation: dragPulse 1.5s ease-in-out infinite;
}

@keyframes dragPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .toc-progress-button {
    width: 48px;
    height: 48px;
  }
  
  .progress-ring-svg {
    width: 48px;
    height: 48px;
  }
  
  .toc-icon {
    width: 16px;
    height: 16px;
  }
  
  .progress-percentage {
    font-size: 0.55rem;
  }
  
  .drag-handle {
    opacity: 0.8;
    width: 12px;
    height: 12px;
  }
}

/* 暗色主题 */
.dark .toc-progress-button {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.dark .toc-progress-button.is-dragging {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
}

.dark .progress-ring-bg {
  stroke: var(--vp-c-border);
  opacity: 0.5;
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .toc-progress-button,
  .toc-icon,
  .drag-handle,
  .drag-preview,
  .progress-ring-fill,
  .toc-badge {
    transition: none !important;
    animation: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .progress-ring-bg,
  .progress-ring-fill {
    stroke-width: 5px;
  }
  
  .toc-progress-button {
    border: 2px solid var(--vp-c-border);
  }
}
</style>