import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

export function useModal(props, emit) {
  const isVisible = ref(false)
  const isFullscreen = ref(false)

  // 关闭模态框
  const closeModal = () => {
    isVisible.value = false
    // 关闭时重置全屏状态
    isFullscreen.value = false
    emit('close')
  }

  // 切换全屏模式
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    emit('fullscreen', isFullscreen.value)
  }

  // 键盘事件处理
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closeModal()
    } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      toggleFullscreen()
    }
  }

  // 监听 props 变化
  watch(() => props.visible, (newVal) => {
    isVisible.value = newVal
    // 每次打开时重置全屏状态
    if (newVal) {
      isFullscreen.value = false
    }
  })

  // 生命周期
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    isVisible,
    isFullscreen,
    closeModal,
    toggleFullscreen
  }
}