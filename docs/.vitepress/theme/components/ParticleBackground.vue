<template>
  <div class="particle-background" ref="containerRef">
    <canvas 
      ref="canvasRef" 
      class="particle-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    ></canvas>
    
    <!-- 交互式粒子效果 -->
    <div class="interactive-particles" v-if="showInteractive">
      <div 
        v-for="particle in interactiveParticles" 
        :key="particle.id"
        class="interactive-particle"
        :style="particle.style"
      ></div>
    </div>
    
    <!-- 知识节点连接效果 -->
    <div class="knowledge-nodes" v-if="showNodes">
      <div 
        v-for="node in knowledgeNodes" 
        :key="node.id"
        class="knowledge-node"
        :class="node.category"
        :style="node.style"
        @mouseenter="onNodeHover(node)"
        @mouseleave="onNodeLeave(node)"
      >
        <div class="node-icon">{{ node.icon }}</div>
        <div class="node-label">{{ node.label }}</div>
        <div class="node-connections">
          <div 
            v-for="connection in node.connections" 
            :key="connection"
            class="connection-line"
            :style="getConnectionStyle(node.id, connection)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  density: {
    type: Number,
    default: 50
  },
  speed: {
    type: Number,
    default: 1
  },
  showInteractive: {
    type: Boolean,
    default: true
  },
  showNodes: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'default' // default, knowledge, tech, minimal
  }
})

const containerRef = ref(null)
const canvasRef = ref(null)
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const particles = ref([])
const interactiveParticles = ref([])
const knowledgeNodes = ref([])

let animationId = null
let ctx = null
let mouseX = 0
let mouseY = 0
let isMouseMoving = false

// 粒子类
class Particle {
  constructor(x, y, theme = 'default') {
    this.x = x
    this.y = y
    this.originalX = x
    this.originalY = y
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    this.radius = Math.random() * 3 + 1
    this.opacity = Math.random() * 0.5 + 0.3
    this.originalOpacity = this.opacity
    this.hue = this.getThemeHue(theme)
    this.saturation = Math.random() * 30 + 70
    this.lightness = Math.random() * 20 + 60
    this.life = Math.random() * 100 + 100
    this.maxLife = this.life
    this.pulse = Math.random() * Math.PI * 2
    this.pulseSpeed = 0.02 + Math.random() * 0.02
  }
  
  getThemeHue(theme) {
    const themes = {
      default: Math.random() * 60 + 200, // 蓝色系
      knowledge: Math.random() * 30 + 45, // 金色系
      tech: Math.random() * 60 + 120, // 绿色系
      minimal: Math.random() * 20 + 220 // 紫色系
    }
    return themes[theme] || themes.default
  }
  
  update() {
    // 基础移动
    this.x += this.vx * props.speed
    this.y += this.vy * props.speed
    
    // 脉动效果
    this.pulse += this.pulseSpeed
    const pulseScale = 1 + Math.sin(this.pulse) * 0.3
    this.currentRadius = this.radius * pulseScale
    
    // 鼠标交互
    if (isMouseMoving) {
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        const force = (100 - distance) / 100
        this.x -= dx * force * 0.02
        this.y -= dy * force * 0.02
        this.opacity = this.originalOpacity + force * 0.3
      } else {
        this.opacity = this.originalOpacity
      }
    }
    
    // 边界检测
    if (this.x < 0 || this.x > canvasWidth.value) this.vx *= -1
    if (this.y < 0 || this.y > canvasHeight.value) this.vy *= -1
    
    // 生命周期
    this.life--
    if (this.life <= 0) {
      this.reset()
    }
  }
  
  reset() {
    this.x = Math.random() * canvasWidth.value
    this.y = Math.random() * canvasHeight.value
    this.originalX = this.x
    this.originalY = this.y
    this.life = this.maxLife
    this.opacity = this.originalOpacity
  }
  
  draw() {
    if (!ctx) return
    
    ctx.save()
    ctx.globalAlpha = this.opacity
    
    // 创建渐变
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.currentRadius * 2
    )
    gradient.addColorStop(0, `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`)
    gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}

// 初始化画布
function initCanvas() {
  if (!canvasRef.value || !containerRef.value) return
  
  const container = containerRef.value
  canvasWidth.value = container.offsetWidth
  canvasHeight.value = container.offsetHeight
  
  ctx = canvasRef.value.getContext('2d')
  
  // 创建粒子
  particles.value = []
  for (let i = 0; i < props.density; i++) {
    particles.value.push(new Particle(
      Math.random() * canvasWidth.value,
      Math.random() * canvasHeight.value,
      props.theme
    ))
  }
}

// 动画循环
function animate() {
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  
  // 更新和绘制粒子
  particles.value.forEach(particle => {
    particle.update()
    particle.draw()
  })
  
  // 绘制连接线
  drawConnections()
  
  animationId = requestAnimationFrame(animate)
}

// 绘制粒子连接线
function drawConnections() {
  if (!ctx) return
  
  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const p1 = particles.value[i]
      const p2 = particles.value[j]
      
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 120) {
        const opacity = (120 - distance) / 120 * 0.2
        
        ctx.save()
        ctx.globalAlpha = opacity
        ctx.strokeStyle = `hsl(${p1.hue}, 50%, 70%)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
        ctx.restore()
      }
    }
  }
}

// 鼠标事件处理
function handleMouseMove(event) {
  const rect = containerRef.value.getBoundingClientRect()
  mouseX = event.clientX - rect.left
  mouseY = event.clientY - rect.top
  isMouseMoving = true
  
  // 创建交互粒子
  if (props.showInteractive && Math.random() < 0.3) {
    createInteractiveParticle(mouseX, mouseY)
  }
}

function handleMouseLeave() {
  isMouseMoving = false
}

// 创建交互粒子
function createInteractiveParticle(x, y) {
  const particle = {
    id: Date.now() + Math.random(),
    style: {
      left: `${x}px`,
      top: `${y}px`,
      animationDelay: '0s'
    }
  }
  
  interactiveParticles.value.push(particle)
  
  // 移除粒子
  setTimeout(() => {
    const index = interactiveParticles.value.findIndex(p => p.id === particle.id)
    if (index > -1) {
      interactiveParticles.value.splice(index, 1)
    }
  }, 1000)
}

// 初始化知识节点
function initKnowledgeNodes() {
  if (!props.showNodes) return
  
  const nodeData = [
    { id: 'ai', icon: '🤖', label: 'AI', category: 'ai', connections: ['cpu', 'python'] },
    { id: 'cpu', icon: '🔧', label: 'CPU', category: 'cpu', connections: ['ai', 'java'] },
    { id: 'java', icon: '☕', label: 'Java', category: 'java', connections: ['cpu', 'algorithm'] },
    { id: 'algorithm', icon: '📊', label: 'Algorithm', category: 'algorithm', connections: ['java', 'python'] },
    { id: 'python', icon: '🐍', label: 'Python', category: 'python', connections: ['algorithm', 'ai'] }
  ]
  
  knowledgeNodes.value = nodeData.map((node, index) => ({
    ...node,
    style: {
      left: `${20 + (index * 15)}%`,
      top: `${30 + Math.sin(index) * 20}%`,
      animationDelay: `${index * 0.2}s`
    }
  }))
}

// 节点悬停事件
function onNodeHover(node) {
  // 高亮连接的节点
  node.connections.forEach(connId => {
    const connNode = knowledgeNodes.value.find(n => n.id === connId)
    if (connNode) {
      connNode.highlighted = true
    }
  })
}

function onNodeLeave(node) {
  // 取消高亮
  knowledgeNodes.value.forEach(n => {
    n.highlighted = false
  })
}

// 获取连接线样式
function getConnectionStyle(fromId, toId) {
  const fromNode = knowledgeNodes.value.find(n => n.id === fromId)
  const toNode = knowledgeNodes.value.find(n => n.id === toId)
  
  if (!fromNode || !toNode) return {}
  
  // 这里可以计算连接线的位置和角度
  return {
    opacity: fromNode.highlighted || toNode.highlighted ? 1 : 0.3
  }
}

// 窗口大小调整
function handleResize() {
  if (!containerRef.value) return
  
  canvasWidth.value = containerRef.value.offsetWidth
  canvasHeight.value = containerRef.value.offsetHeight
  
  // 重新定位粒子
  particles.value.forEach(particle => {
    if (particle.x > canvasWidth.value) particle.x = canvasWidth.value
    if (particle.y > canvasHeight.value) particle.y = canvasHeight.value
  })
}

onMounted(async () => {
  await nextTick()
  initCanvas()
  initKnowledgeNodes()
  animate()
  
  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', handleMouseMove)
    containerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }
  
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 交互式粒子 */
.interactive-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.interactive-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, var(--vp-c-brand-1), transparent);
  border-radius: 50%;
  animation: particle-burst 1s ease-out forwards;
  transform: translate(-50%, -50%);
}

@keyframes particle-burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.5);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5) translateY(-20px);
  }
}

/* 知识节点 */
.knowledge-nodes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.knowledge-node {
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-border);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: node-float 3s ease-in-out infinite;
  backdrop-filter: blur(10px);
}

.knowledge-node:hover {
  transform: scale(1.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: var(--vp-c-brand-1);
}

.knowledge-node.highlighted {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 20px var(--vp-c-brand-1);
}

.node-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.node-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
}

@keyframes node-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 分类特定样式 */
.knowledge-node.ai {
  border-color: #ff6b6b;
}

.knowledge-node.cpu {
  border-color: #4ecdc4;
}

.knowledge-node.java {
  border-color: #45b7d1;
}

.knowledge-node.algorithm {
  border-color: #96ceb4;
}

.knowledge-node.python {
  border-color: #feca57;
}

/* 连接线 */
.node-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  transform-origin: left center;
  transition: opacity 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .knowledge-node {
    width: 60px;
    height: 60px;
  }
  
  .node-icon {
    font-size: 1.2rem;
  }
  
  .node-label {
    font-size: 0.6rem;
  }
}

/* 暗色主题适配 */
.dark .knowledge-node {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

.dark .interactive-particle {
  background: radial-gradient(circle, var(--vp-c-brand-1), transparent);
}

/* 性能优化 */
.particle-background {
  will-change: transform;
}

.particle-canvas {
  will-change: contents;
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .interactive-particle,
  .knowledge-node {
    animation: none;
  }
  
  .knowledge-node:hover {
    transform: none;
  }
}
</style>