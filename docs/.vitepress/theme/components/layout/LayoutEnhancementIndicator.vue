<template>
  <div :class="$style.layoutEnhancementIndicator"></div>
</template>

<style module>
.layoutEnhancementIndicator {
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  opacity: 0.8;
}
</style>