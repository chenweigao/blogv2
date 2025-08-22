<template>
  <button
    class="toc-toggle"
    :class="{ 'is-active': isActive, 'is-dragging': isDragging }"
    @click="handleClick"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
    :title="isActive ? 'Hide TOC' : 'Show TOC'"
    :aria-label="isActive ? 'Hide table of contents' : 'Show table of contents'"
    :aria-expanded="isActive"
    :style="buttonStyle"
  >
    <svg class="toc-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
    </svg>
    <span class="toc-badge" v-if="headingCount > 0">{{ headingCount }}</span>
    
    <!-- Drag Handle -->
    <div class="drag-handle" v-if="isDraggable">
      <svg viewBox="0 0 24 24" width="12" height="12">
        <path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"/>
      </svg>
    </div>
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
  }
})

const emit = defineEmits(['click', 'drag-start', 'drag-move', 'drag-end'])

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const currentPosition = ref({ ...props.position })

const buttonStyle = computed(() => ({
  transform: `translate(${currentPosition.value.x}px, ${currentPosition.value.y}px)`,
  transition: isDragging.value ? 'none' : 'transform 0.3s ease'
}))

const handleClick = (event) => {
  if (!isDragging.value) {
    emit('click', event)
  }
}

const handleMouseDown = (event) => {
  if (!props.isDraggable) return
  
  event.preventDefault()
  startDrag(event.clientX, event.clientY)
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleTouchStart = (event) => {
  if (!props.isDraggable) return
  
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
  
  // 边界检测
  const maxX = window.innerWidth - 60
  const maxY = window.innerHeight - 60
  
  currentPosition.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
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
    emit('drag-end', { ...currentPosition.value })
  }
}

// 设置位置（供外部调用）
const setPosition = (newPosition) => {
  currentPosition.value = { ...newPosition }
}

// 重置位置
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
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<style scoped>
.toc-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  user-select: none;
  touch-action: none;
}

.toc-toggle:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.toc-toggle.is-active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
  box-shadow: 0 6px 20px rgba(var(--vp-c-brand-rgb), 0.3);
}

.toc-toggle.is-dragging {
  cursor: grabbing;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.toc-icon {
  transition: transform 0.3s ease;
}

.toc-toggle.is-active .toc-icon {
  transform: rotate(180deg);
}

.toc-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 9px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.toc-toggle.is-active .toc-badge {
  background: white;
  color: var(--vp-c-brand-1);
}

.drag-handle {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: grab;
}

.toc-toggle:hover .drag-handle {
  opacity: 1;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle svg {
  opacity: 0.6;
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .toc-toggle {
    width: 44px;
    height: 44px;
  }
  
  .drag-handle {
    opacity: 1;
  }
}

/* 暗色主题 */
.dark .toc-toggle {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .toc-toggle.is-dragging {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .toc-toggle,
  .toc-icon,
  .drag-handle {
    transition: none !important;
  }
}
</style>