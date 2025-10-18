<template>
  <div class="page-transition-wrapper">
    <!-- 简化的顶部进度条 -->
    <div v-if="isTransitioning" class="page-loading-bar">
      <div class="loading-progress" :style="{ width: `${progress}%` }"></div>
    </div>
    
    <!-- 页面内容过渡容器 -->
    <Transition 
      name="page-content" 
      mode="out-in"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
      @after-enter="onAfterEnter"
    >
      <div :key="routeKey" class="page-content-wrapper">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const isTransitioning = ref(false)
const progress = ref(0)

let progressInterval = null
let transitionTimeout = null

// 监听路由变化
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    startTransition()
  }
}, { immediate: false })

// 开始轻量级页面切换
function startTransition() {
  if (isTransitioning.value) return
  
  isTransitioning.value = true
  progress.value = 0
  
  // 快速进度动画
  startProgressAnimation()
  
  // 短暂的过渡时间
  transitionTimeout = setTimeout(() => {
    endTransition()
  }, 600)
}

// 结束页面切换
function endTransition() {
  progress.value = 100
  
  setTimeout(() => {
    isTransitioning.value = false
    progress.value = 0
    clearProgressAnimation()
  }, 200)
}

// 快速进度动画
function startProgressAnimation() {
  clearProgressAnimation()
  
  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      const increment = Math.random() * 25 + 10
      progress.value = Math.min(progress.value + increment, 90)
    }
  }, 50)
}

// 清除动画
function clearProgressAnimation() {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (transitionTimeout) {
    clearTimeout(transitionTimeout)
    transitionTimeout = null
  }
}

// 页面内容过渡钩子
function onBeforeEnter(el) {
  el.style.opacity = '0'
  el.style.transform = 'translateY(10px)'
}

function onEnter(el, done) {
  nextTick(() => {
    el.style.transition = 'all 0.25s ease-out'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
    
    setTimeout(() => {
      endTransition()
      done()
    }, 100)
  })
}

function onLeave(el, done) {
  el.style.transition = 'all 0.15s ease-in'
  el.style.opacity = '0.7'
  el.style.transform = 'translateY(-5px)'
  
  setTimeout(done, 150)
}

onUnmounted(() => {
  clearProgressAnimation()
})
</script>

<style scoped>
.page-transition-wrapper {
  position: relative;
}

/* 轻量级顶部进度条 */
.page-loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 9999;
  background: transparent;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  transition: width 0.1s ease;
  box-shadow: 0 0 8px var(--vp-c-brand-1);
}

/* 页面内容过渡 */
.page-content-enter-active {
  transition: all 0.25s ease-out;
}

.page-content-leave-active {
  transition: all 0.15s ease-in;
}

.page-content-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-content-leave-to {
  opacity: 0.7;
  transform: translateY(-5px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .page-content-enter-from {
    transform: translateY(5px);
  }
  
  .page-content-leave-to {
    transform: translateY(-3px);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .page-content-enter-active,
  .page-content-leave-active {
    transition: none !important;
  }
  
  .loading-progress {
    transition: none !important;
  }
}
</style>