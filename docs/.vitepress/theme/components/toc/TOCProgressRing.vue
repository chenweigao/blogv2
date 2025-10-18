<template>
  <div class="reading-progress-ring" v-if="showProgress">
    <svg class="progress-ring" width="50" height="50">
      <circle
        class="progress-ring-background"
        cx="25"
        cy="25"
        r="20"
        fill="transparent"
        stroke="var(--vp-c-border)"
        stroke-width="2"
      />
      <circle
        class="progress-ring-progress"
        cx="25"
        cy="25"
        r="20"
        fill="transparent"
        stroke="var(--vp-c-brand-1)"
        stroke-width="2"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="progressOffset"
        transform="rotate(-90 25 25)"
      />
    </svg>
    <div class="progress-percentage">{{ Math.round(progress) }}%</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  size: {
    type: Number,
    default: 50
  },
  strokeWidth: {
    type: Number,
    default: 2
  }
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const progressOffset = computed(() => {
  return circumference.value - (props.progress / 100) * circumference.value
})
</script>

<style scoped>
.reading-progress-ring {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
}

.progress-ring {
  transform: rotate(-90deg);
  transition: all 0.3s ease;
}

.progress-ring-background {
  opacity: 0.3;
}

.progress-ring-progress {
  transition: stroke-dashoffset 0.3s ease;
  filter: drop-shadow(0 0 2px var(--vp-c-brand-1));
}

.progress-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.progress-ring-progress[stroke-dashoffset="0"] {
  animation: pulse 2s ease-in-out;
}

/* 暗色主题适配 */
.dark .progress-percentage {
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .progress-ring,
  .progress-ring-progress {
    transition: none !important;
  }
  
  .progress-ring-progress {
    animation: none !important;
  }
}
</style>