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
        <!-- TOC 图标 - 修复了SVG路径 -->
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

// 简化状态管理，移除内部拖拽逻辑
const isDragging = ref(false)
const hasMoved = ref(false)

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
  transform: `translate3d(${props.position.x}px, ${props.position.y}px, 0)`,
  transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: isDragging.value ? 1000 : 100,
  willChange: isDragging.value ? 'transform' : 'auto'
}))

// 简化点击处理逻辑
const handleClick = (event) => {
  console.log('Button clicked!', { isDragging: isDragging.value, hasMoved: hasMoved.value })
  
  // 如果正在拖拽或者已经移动过，则不触发点击
  if (isDragging.value || hasMoved.value) {
    console.log('Click prevented due to drag')
    return
  }
  
  // 阻止事件冒泡
  event.stopPropagation()
  
  // 直接触发点击事件
  console.log('Emitting click event')
  emit('click', event)
}

// 拖拽开始处理（由外部 useDragAndDrop 调用）
const handleDragStart = (event) => {
  event.preventDefault()
  isDragging.value = true
  hasMoved.value = true
  emit('drag-start', { x: props.position.x, y: props.position.y })
}

// 拖拽移动处理（由外部 useDragAndDrop 调用）
const handleDragMove = (position) => {
  emit('drag-move', position)
}

// 拖拽结束处理（由外部 useDragAndDrop 调用）
const handleDragEnd = (position) => {
  isDragging.value = false
  emit('drag-end', position)
  
  // 延迟重置移动标记，确保点击事件不会被误触发
  setTimeout(() => {
    hasMoved.value = false
  }, 100)
}

// 外部调用的位置更新方法
const setPosition = (newPosition) => {
  // 位置由外部 useDragAndDrop 管理，这里只是为了兼容性
  emit('drag-move', newPosition)
}

const resetPosition = () => {
  emit('drag-move', { x: 0, y: 0 })
}

defineExpose({
  updatePosition: setPosition,
  resetPosition,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  element: ref(null) // 暴露元素引用给外部拖拽系统
})

onMounted(() => {
  // 移除内部拖拽事件监听，完全依赖外部系统
})

onUnmounted(() => {
  // 清理工作已由外部 useDragAndDrop 处理
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
  touch-action: manipulation;
  overflow: visible;
  /* 确保点击事件正常工作 */
  pointer-events: auto;
  
  /* GPU 加速优化 */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  
  /* 拖拽优化 */
  will-change: auto;
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
  
  /* 拖拽时的 GPU 加速 */
  will-change: transform;
  backface-visibility: hidden;
  
  /* 拖拽时的视觉效果 */
  filter: brightness(1.1);
  transition: none !important;
}

/* 拖拽时的额外视觉反馈 */
.toc-progress-button.is-dragging::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0.3;
  animation: dragPulse 1.5s ease-in-out infinite;
  pointer-events: none;
}

.progress-ring-svg {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
  pointer-events: none;
  
  /* GPU 加速 */
  will-change: auto;
  backface-visibility: hidden;
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
  
  /* 优化 SVG 渲染 */
  shape-rendering: geometricPrecision;
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
  /* 允许点击事件穿透到按钮 */
  pointer-events: none;
  
  /* GPU 加速 */
  transform: translate3d(0, 0, 0);
}

.toc-icon {
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
  margin-bottom: 2px;
  /* 确保图标不会阻止点击 */
  pointer-events: none;
  
  /* GPU 加速 */
  transform: translate3d(0, 0, 0);
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
  pointer-events: none;
  
  /* GPU 加速 */
  transform: translate3d(0, 0, 0);
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
  pointer-events: none;
  
  /* GPU 加速 */
  transform: translate3d(0, 0, 0);
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
  pointer-events: auto;
  
  /* GPU 加速 */
  transform: translate3d(0, 0, 0);
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
  pointer-events: none;
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
  
  /* GPU 加速 */
  transform: translate3d(0, 0, 0);
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
    /* 移动设备上禁用拖拽，确保点击正常 */
    touch-action: manipulation;
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
  
  .toc-progress-button.is-dragging::before {
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

/* 确保按钮在所有情况下都可以点击 */
.toc-progress-button:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.toc-progress-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/* 性能优化：减少重绘和回流 */
.toc-progress-button * {
  box-sizing: border-box;
}

/* 拖拽时的性能优化 */
.toc-progress-button.is-dragging * {
  pointer-events: none;
}

/* 确保拖拽时的流畅性 */
.toc-progress-button.is-dragging {
  contain: layout style paint;
}
</style>