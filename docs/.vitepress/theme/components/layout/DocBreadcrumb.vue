<template>
  <nav :class="$style.breadcrumb" v-if="breadcrumbs.length > 0">
    <ol :class="[$style.breadcrumbList, 'group', 'stagger-inview', 'motion-layer']">
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="index" 
        :class="[$style.breadcrumbItem, 'auto-inview']"
      >
        <a 
          v-if="crumb.link" 
          :href="crumb.link" 
          :class="[$style.breadcrumbLink, 'u-focus-ring', 'group-hover-underline', 'underline-center', 'press-active', 'hover-pop']"
        >
          {{ crumb.text }}
        </a>
        <span v-else :class="[$style.breadcrumbCurrent, 'auto-inview']">{{ crumb.text }}</span>
        <span 
          v-if="index < breadcrumbs.length - 1" 
          :class="$style.breadcrumbSeparator"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

// 生成面包屑导航
const breadcrumbs = computed(() => {
  if (!page.value?.relativePath) return []
  
  const pathParts = page.value.relativePath.replace(/\.md$/, '').split('/')
  const crumbs = []
  
  // 添加首页
  crumbs.push({ text: 'Home', link: '/' })
  
  // 添加路径层级
  let currentPath = ''
  for (let i = 0; i < pathParts.length - 1; i++) {
    currentPath += '/' + pathParts[i]
    crumbs.push({
      text: pathParts[i].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      link: currentPath + '/'
    })
  }
  
  // 添加当前页面
  if (pathParts.length > 0) {
    let currentTitle = frontmatter.value?.title || 
      pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    if (currentTitle && currentTitle.length > 30) {
      const titleParts = currentTitle.split(/[-–—:：]/)
      if (titleParts.length > 1) {
        currentTitle = titleParts[0].trim()
      } else {
        currentTitle = currentTitle.substring(0, 30) + '...'
      }
    }
    
    crumbs.push({ text: currentTitle })
  }
  
  return crumbs
})
</script>

<style module>
.breadcrumb {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider-light);
  position: relative;
}

.breadcrumb::after {
  content: '';
  position: absolute;
  bottom: -1px;
  inset-inline-start: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  border-radius: 1px;
}

.breadcrumbList {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  gap: 0.25rem;
}

.breadcrumbItem {
  display: flex;
  align-items: center;
  /* 统一使用全局动效变量 */
  transition: transform var(--motion-duration-xshort) var(--motion-ease-decelerate);
}

.breadcrumbItem:last-child {
  font-weight: 600;
}

.breadcrumbItem:hover {
  transform: translateY(-1px);
}

.breadcrumbLink {
  color: var(--vp-c-text-2);
  text-decoration: none;
  /* 统一使用全局动效变量 */
  transition: color var(--motion-duration-short) var(--motion-ease-standard);
}

.breadcrumbLink:hover {
  color: var(--vp-c-brand-1);
}

.breadcrumbCurrent {
  color: var(--vp-c-text-1);
  font-weight: 500;
  font-size: 0.85rem;
  opacity: 0.9;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.breadcrumbSeparator {
  margin: 0 0.5rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .breadcrumbList {
    flex-wrap: wrap;
  }
}

/* Reduced Motion：禁用位移动效与过渡 */
@media (prefers-reduced-motion: reduce) {
  .breadcrumbItem,
  .breadcrumbLink {
    transition: none !important;
  }
  .breadcrumbItem:hover {
    transform: none !important;
  }
}

/* 触控设备适配：避免位移造成不适 */
@media (pointer: coarse) {
  .breadcrumbItem {
    transition-duration: 140ms;
  }
  .breadcrumbItem:hover {
    transform: none;
  }
}

/* 全局性能/兼容实用类（以 :global 定义） */
:global(.motion-layer) {
  contain: layout paint style;
}
:global(.motion-accelerate) {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>