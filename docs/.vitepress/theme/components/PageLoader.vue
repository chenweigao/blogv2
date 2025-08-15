<template>
  <Transition name="loader" appear>
    <div v-if="isLoading" class="page-loader">
      <div class="loader-content">
        <!-- 主加载动画 -->
        <div class="loader-animation">
          <div class="loader-circle">
            <div class="loader-wave"></div>
            <div class="loader-wave"></div>
            <div class="loader-wave"></div>
          </div>
          <div class="loader-text">
            <span class="loader-char" v-for="(char, index) in loadingText" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
              {{ char }}
            </span>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="loader-progress">
          <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
        </div>
        
        <!-- 知识库图标动画 -->
        <div class="knowledge-icons">
          <div class="icon-orbit">
            <div class="orbit-icon" v-for="(icon, index) in icons" :key="index" :style="{ animationDelay: `${index * 0.2}s` }">
              {{ icon }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 背景粒子效果 -->
      <div class="loader-particles">
        <div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle(n)"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isLoading = ref(true)
const progress = ref(0)
const loadingText = 'Knowledge Wiki'

const icons = ['📚', '💡', '🔬', '⚡', '🎯', '🚀', '💻', '🧠']

// 模拟加载进度
let progressInterval = null

onMounted(() => {
  // 模拟加载进度
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.random() * 15
      if (progress.value > 100) progress.value = 100
    } else {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
      clearInterval(progressInterval)
    }
  }, 200)
  
  // 最长加载时间限制
  setTimeout(() => {
    if (isLoading.value) {
      progress.value = 100
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }, 3000)
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

// 生成粒子样式
function getParticleStyle(index) {
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 3
  const size = 2 + Math.random() * 4
  const left = Math.random() * 100
  const opacity = 0.3 + Math.random() * 0.7
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: opacity
  }
}
</script>

<style scoped>
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, 
    var(--vp-c-bg) 0%, 
    var(--vp-c-bg-alt) 50%, 
    var(--vp-c-bg) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.loader-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

/* 主加载动画 */
.loader-animation {
  margin-bottom: 2rem;
}

.loader-circle {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotate 2s linear infinite;
}

.loader-circle::before {
  content: '📚';
  font-size: 3rem;
  animation: counter-rotate 2s linear infinite;
}

.loader-wave {
  position: absolute;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  opacity: 0;
  animation: wave 2s ease-out infinite;
}

.loader-wave:nth-child(1) {
  animation-delay: 0s;
}

.loader-wave:nth-child(2) {
  animation-delay: 0.5s;
}

.loader-wave:nth-child(3) {
  animation-delay: 1s;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes counter-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes wave {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

/* 加载文字动画 */
.loader-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 2rem;
}

.loader-char {
  display: inline-block;
  animation: bounce 1.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 进度条 */
.loader-progress {
  width: 300px;
  height: 4px;
  background: var(--vp-c-bg-soft);
  border-radius: 2px;
  margin: 0 auto 2rem;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 2px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
  animation: shimmer 1s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-20px); }
  100% { transform: translateX(20px); }
}

/* 知识库图标轨道动画 */
.knowledge-icons {
  margin-top: 2rem;
}

.icon-orbit {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.orbit-icon {
  position: absolute;
  width: 30px;
  height: 30px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-border);
  animation: orbit 8s linear infinite;
  transform-origin: 100px 100px;
}

.orbit-icon:nth-child(1) { transform: rotate(0deg) translateX(100px) rotate(0deg); }
.orbit-icon:nth-child(2) { transform: rotate(45deg) translateX(100px) rotate(-45deg); }
.orbit-icon:nth-child(3) { transform: rotate(90deg) translateX(100px) rotate(-90deg); }
.orbit-icon:nth-child(4) { transform: rotate(135deg) translateX(100px) rotate(-135deg); }
.orbit-icon:nth-child(5) { transform: rotate(180deg) translateX(100px) rotate(-180deg); }
.orbit-icon:nth-child(6) { transform: rotate(225deg) translateX(100px) rotate(-225deg); }
.orbit-icon:nth-child(7) { transform: rotate(270deg) translateX(100px) rotate(-270deg); }
.orbit-icon:nth-child(8) { transform: rotate(315deg) translateX(100px) rotate(-315deg); }

@keyframes orbit {
  from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
}

/* 背景粒子效果 */
.loader-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: float-up linear infinite;
}

@keyframes float-up {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* 过渡动画 */
.loader-enter-active {
  transition: all 0.5s ease;
}

.loader-leave-active {
  transition: all 0.8s ease;
}

.loader-enter-from {
  opacity: 0;
  transform: scale(1.1);
}

.loader-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 暗色主题适配 */
.dark .page-loader {
  background: linear-gradient(135deg, 
    var(--vp-c-bg) 0%, 
    var(--vp-c-bg-alt) 50%, 
    var(--vp-c-bg) 100%);
}

.dark .orbit-icon {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loader-circle {
    width: 80px;
    height: 80px;
  }
  
  .loader-circle::before {
    font-size: 2rem;
  }
  
  .loader-text {
    font-size: 1.2rem;
  }
  
  .loader-progress {
    width: 250px;
  }
  
  .icon-orbit {
    width: 150px;
    height: 150px;
  }
  
  .orbit-icon {
    width: 25px;
    height: 25px;
    font-size: 1.2rem;
    transform-origin: 75px 75px;
  }
  
  .orbit-icon:nth-child(1) { transform: rotate(0deg) translateX(75px) rotate(0deg); }
  .orbit-icon:nth-child(2) { transform: rotate(45deg) translateX(75px) rotate(-45deg); }
  .orbit-icon:nth-child(3) { transform: rotate(90deg) translateX(75px) rotate(-90deg); }
  .orbit-icon:nth-child(4) { transform: rotate(135deg) translateX(75px) rotate(-135deg); }
  .orbit-icon:nth-child(5) { transform: rotate(180deg) translateX(75px) rotate(-180deg); }
  .orbit-icon:nth-child(6) { transform: rotate(225deg) translateX(75px) rotate(-225deg); }
  .orbit-icon:nth-child(7) { transform: rotate(270deg) translateX(75px) rotate(-270deg); }
  .orbit-icon:nth-child(8) { transform: rotate(315deg) translateX(75px) rotate(-315deg); }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .loader-circle,
  .loader-wave,
  .orbit-icon,
  .particle {
    animation: none;
  }
  
  .loader-char {
    animation: none;
    transform: none;
  }
}
</style>