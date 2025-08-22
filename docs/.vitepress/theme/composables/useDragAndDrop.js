import { ref, reactive, onMounted, onUnmounted } from 'vue'

export function useDragAndDrop(options = {}) {
  const {
    storageKey = 'toc-position',
    defaultPosition = { x: 0, y: 0 },
    constrainToViewport = true,
    snapToEdges = false,
    snapThreshold = 20
  } = options
  
  // State
  const isDragging = ref(false)
  const position = reactive({ ...defaultPosition })
  const dragStart = reactive({ x: 0, y: 0 })
  
  // Drag handlers
  let currentElement = null
  
  const startDrag = (element, clientX, clientY) => {
    if (!element) return
    
    currentElement = element
    isDragging.value = true
    
    dragStart.x = clientX - position.x
    dragStart.y = clientY - position.y
    
    // Add dragging class
    element.classList.add('is-dragging')
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }
  
  const updatePosition = (clientX, clientY) => {
    if (!isDragging.value) return
    
    let newX = clientX - dragStart.x
    let newY = clientY - dragStart.y
    
    if (constrainToViewport) {
      const elementWidth = currentElement?.offsetWidth || 60
      const elementHeight = currentElement?.offsetHeight || 60
      
      const maxX = window.innerWidth - elementWidth
      const maxY = window.innerHeight - elementHeight
      
      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))
    }
    
    if (snapToEdges) {
      // Snap to edges
      const threshold = snapThreshold
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      if (newX < threshold) newX = 0
      if (newX > viewportWidth - threshold - (currentElement?.offsetWidth || 60)) {
        newX = viewportWidth - (currentElement?.offsetWidth || 60)
      }
      if (newY < threshold) newY = 0
      if (newY > viewportHeight - threshold - (currentElement?.offsetHeight || 60)) {
        newY = viewportHeight - (currentElement?.offsetHeight || 60)
      }
    }
    
    position.x = newX
    position.y = newY
  }
  
  const endDrag = () => {
    if (!isDragging.value) return
    
    isDragging.value = false
    
    if (currentElement) {
      currentElement.classList.remove('is-dragging')
    }
    
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    
    // Save position
    savePosition()
    
    currentElement = null
  }

  // Mouse events
  const handleMouseMove = (event) => {
    if (!isDragging.value) return
    event.preventDefault()
    updatePosition(event.clientX, event.clientY)
  }
  
  const handleMouseUp = () => {
    endDrag()
  }
  
  // Touch events
  const handleTouchMove = (event) => {
    if (!isDragging.value) return
    event.preventDefault()
    const touch = event.touches[0]
    updatePosition(touch.clientX, touch.clientY)
  }
  
  const handleTouchEnd = () => {
    endDrag()
  }
  
  // Keyboard events
  const handleKeyDown = (event) => {
    if (!isDragging.value) return
    
    if (event.key === 'Escape') {
      endDrag()
    }
  }
  
  // Position management
  const savePosition = () => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(position))
      } catch (error) {
        console.warn('Failed to save position:', error)
      }
    }
  }
  
  const loadPosition = () => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const savedPosition = JSON.parse(saved)
          position.x = savedPosition.x || defaultPosition.x
          position.y = savedPosition.y || defaultPosition.y
          return true
        }
      } catch (error) {
        console.warn('Failed to load position:', error)
      }
    }
    return false
  }
  
  const resetPosition = () => {
    position.x = defaultPosition.x
    position.y = defaultPosition.y
    savePosition()
  }
  
  const setPosition = (newPosition) => {
    position.x = newPosition.x
    position.y = newPosition.y
    savePosition()
  }
  
  // Viewport constraint check
  const constrainToCurrentViewport = () => {
    if (!constrainToViewport) return
    
    const elementWidth = currentElement?.offsetWidth || 60
    const elementHeight = currentElement?.offsetHeight || 60
    
    const maxX = window.innerWidth - elementWidth
    const maxY = window.innerHeight - elementHeight
    
    const newX = Math.max(0, Math.min(position.x, maxX))
    const newY = Math.max(0, Math.min(position.y, maxY))
    
    if (newX !== position.x || newY !== position.y) {
      position.x = newX
      position.y = newY
      savePosition()
    }
  }
  
  // Window resize handler
  const handleResize = () => {
    constrainToCurrentViewport()
  }
  
  // Drag API
  const createDragHandlers = (element) => {
    const handleMouseDown = (event) => {
      event.preventDefault()
      startDrag(element, event.clientX, event.clientY)
    }
    
    const handleTouchStart = (event) => {
      event.preventDefault()
      const touch = event.touches[0]
      startDrag(element, touch.clientX, touch.clientY)
    }
    
    return {
      handleMouseDown,
      handleTouchStart
    }
  }
  
  // Lifecycle
  const initialize = () => {
    // Load saved position
    loadPosition()
    
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: false })
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    
    // Constrain to viewport on load
    setTimeout(constrainToCurrentViewport, 100)
  }
  
  const cleanup = () => {
    // Clean up any ongoing drag
    endDrag()
    
    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
    document.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('resize', handleResize)
  }
  
  // Auto initialize
  onMounted(initialize)
  onUnmounted(cleanup)
  
  return {
    // State
    isDragging,
    position,
    
    // Methods
    startDrag,
    updatePosition,
    endDrag,
    savePosition,
    loadPosition,
    resetPosition,
    setPosition,
    createDragHandlers,
    constrainToCurrentViewport,
    
    // Lifecycle
    initialize,
    cleanup
  }
}