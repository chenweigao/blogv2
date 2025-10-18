import { ref, reactive, onMounted, onUnmounted } from 'vue'

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

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
  
  // Performance optimization variables
  let currentElement = null
  let animationFrameId = null
  let pendingUpdate = false
  let lastUpdateTime = 0
  const updateThrottle = 16 // ~60fps
  
  // Pending position for smooth updates
  let pendingPosition = { x: 0, y: 0 }
  
  // Performance optimized position update
  const schedulePositionUpdate = (newX, newY) => {
    if (!isBrowser) return
    
    pendingPosition.x = newX
    pendingPosition.y = newY
    
    if (!pendingUpdate) {
      pendingUpdate = true
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const now = performance.now()
        
        // Throttle updates to maintain 60fps
        if (now - lastUpdateTime >= updateThrottle) {
          position.x = pendingPosition.x
          position.y = pendingPosition.y
          lastUpdateTime = now
        }
        
        pendingUpdate = false
        animationFrameId = null
      })
    }
  }
  
  // Optimized drag start with GPU acceleration setup
  const startDrag = (element, clientX, clientY) => {
    if (!isBrowser || !element) return
    
    currentElement = element
    isDragging.value = true
    
    dragStart.x = clientX - position.x
    dragStart.y = clientY - position.y
    
    // Add dragging class and GPU acceleration
    element.classList.add('is-dragging')
    
    // Enable GPU acceleration and optimize for dragging
    element.style.willChange = 'transform'
    element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`
    
    // Optimize document for dragging
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
    document.body.style.touchAction = 'none' // Prevent scrolling on touch devices
    
    // Add visual feedback
    element.style.transition = 'none'
    element.style.zIndex = '1000'
  }
  
  const updatePosition = (clientX, clientY) => {
    if (!isBrowser || !isDragging.value) return
    
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
    
    // Use optimized position update
    schedulePositionUpdate(newX, newY)
    
    // Immediately update transform for smooth visual feedback
    if (currentElement) {
      currentElement.style.transform = `translate3d(${newX}px, ${newY}px, 0)`
    }
  }
  
  const endDrag = () => {
    if (!isBrowser || !isDragging.value) return
    
    isDragging.value = false
    
    // Cancel any pending animation frame
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    
    if (currentElement) {
      currentElement.classList.remove('is-dragging')
      
      // Reset GPU acceleration hints
      currentElement.style.willChange = 'auto'
      currentElement.style.transition = ''
      currentElement.style.zIndex = ''
      
      // Ensure final position is set
      currentElement.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`
    }
    
    // Reset document styles
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    document.body.style.touchAction = ''
    
    // Save position
    savePosition()
    
    currentElement = null
    pendingUpdate = false
  }

  // Optimized mouse events with passive listeners where possible
  const handleMouseMove = (event) => {
    if (!isBrowser || !isDragging.value) return
    event.preventDefault()
    updatePosition(event.clientX, event.clientY)
  }
  
  const handleMouseUp = (event) => {
    if (!isBrowser) return
    if (isDragging.value) {
      event.preventDefault()
      endDrag()
    }
  }
  
  // Optimized touch events
  const handleTouchMove = (event) => {
    if (!isBrowser || !isDragging.value) return
    event.preventDefault()
    const touch = event.touches[0]
    if (touch) {
      updatePosition(touch.clientX, touch.clientY)
    }
  }
  
  const handleTouchEnd = (event) => {
    if (!isBrowser) return
    if (isDragging.value) {
      event.preventDefault()
      endDrag()
    }
  }
  
  // Keyboard events
  const handleKeyDown = (event) => {
    if (!isBrowser || !isDragging.value) return
    
    if (event.key === 'Escape') {
      event.preventDefault()
      endDrag()
    }
  }
  
  // Optimized position management
  const savePosition = () => {
    if (!isBrowser || !storageKey) return
    
    try {
      // Use a microtask to avoid blocking the main thread
      queueMicrotask(() => {
        localStorage.setItem(storageKey, JSON.stringify({
          x: position.x,
          y: position.y,
          timestamp: Date.now()
        }))
      })
    } catch (error) {
      console.warn('Failed to save position:', error)
    }
  }
  
  const loadPosition = () => {
    if (!isBrowser || !storageKey) {
      // Fallback to default position for SSR
      position.x = defaultPosition.x
      position.y = defaultPosition.y
      return false
    }
    
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const savedData = JSON.parse(saved)
        // Check if saved position is not too old (optional)
        const isRecent = !savedData.timestamp || (Date.now() - savedData.timestamp < 7 * 24 * 60 * 60 * 1000) // 7 days
        
        if (isRecent && typeof savedData.x === 'number' && typeof savedData.y === 'number') {
          position.x = savedData.x
          position.y = savedData.y
          return true
        }
      }
    } catch (error) {
      console.warn('Failed to load position:', error)
    }
    
    // Fallback to default position
    position.x = defaultPosition.x
    position.y = defaultPosition.y
    return false
  }
  
  const resetPosition = () => {
    position.x = defaultPosition.x
    position.y = defaultPosition.y
    if (isBrowser) {
      savePosition()
    }
  }
  
  const setPosition = (newPosition) => {
    position.x = newPosition.x
    position.y = newPosition.y
    if (isBrowser) {
      savePosition()
    }
  }
  
  // Optimized viewport constraint check
  const constrainToCurrentViewport = () => {
    if (!isBrowser || !constrainToViewport) return
    
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
  
  // Debounced window resize handler
  let resizeTimeout = null
  const handleResize = () => {
    if (!isBrowser) return
    
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    
    resizeTimeout = setTimeout(() => {
      constrainToCurrentViewport()
      resizeTimeout = null
    }, 100)
  }
  
  // Enhanced drag API with better performance
  const createDragHandlers = (element) => {
    if (!isBrowser) {
      return {
        handleMouseDown: () => {},
        handleTouchStart: () => {}
      }
    }
    
    const handleMouseDown = (event) => {
      // Only handle left mouse button
      if (event.button !== 0) return
      
      event.preventDefault()
      event.stopPropagation()
      startDrag(element, event.clientX, event.clientY)
    }
    
    const handleTouchStart = (event) => {
      // Only handle single touch
      if (event.touches.length !== 1) return
      
      event.preventDefault()
      event.stopPropagation()
      const touch = event.touches[0]
      startDrag(element, touch.clientX, touch.clientY)
    }
    
    return {
      handleMouseDown,
      handleTouchStart
    }
  }
  
  // Lifecycle with better cleanup
  const initialize = () => {
    if (!isBrowser) return
    
    // Load saved position
    loadPosition()
    
    // Add global event listeners with optimized options
    document.addEventListener('mousemove', handleMouseMove, { 
      passive: false,
      capture: true 
    })
    document.addEventListener('mouseup', handleMouseUp, {
      passive: false,
      capture: true
    })
    document.addEventListener('touchmove', handleTouchMove, { 
      passive: false,
      capture: true 
    })
    document.addEventListener('touchend', handleTouchEnd, {
      passive: false,
      capture: true
    })
    document.addEventListener('keydown', handleKeyDown, {
      passive: false
    })
    window.addEventListener('resize', handleResize, {
      passive: true
    })
    
    // Constrain to viewport on load with a slight delay for layout
    requestAnimationFrame(() => {
      setTimeout(constrainToCurrentViewport, 50)
    })
  }
  
  const cleanup = () => {
    if (!isBrowser) return
    
    // Clean up any ongoing drag
    endDrag()
    
    // Clear timeouts
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
      resizeTimeout = null
    }
    
    // Cancel animation frames
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    
    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove, { capture: true })
    document.removeEventListener('mouseup', handleMouseUp, { capture: true })
    document.removeEventListener('touchmove', handleTouchMove, { capture: true })
    document.removeEventListener('touchend', handleTouchEnd, { capture: true })
    document.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('resize', handleResize)
  }
  
  // Auto initialize - only on client side
  onMounted(() => {
    if (isBrowser) {
      initialize()
    }
  })
  
  onUnmounted(() => {
    if (isBrowser) {
      cleanup()
    }
  })
  
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
    constrainToCurrentViewport,
    createDragHandlers,
    
    // Cleanup
    cleanup
  }
}