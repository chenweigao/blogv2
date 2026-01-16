<template>
  <div class="navbar-enhancer">
    <!-- 路由切换指示器 -->
    <div 
      ref="routeIndicator"
      class="nav-route-indicator"
      :style="indicatorStyle"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const routeIndicator = ref(null)
const activeNavItem = ref(null)
const indicatorStyle = ref({})

// 新增：统一的刷新调度（避免多重 setTimeout 重试）
let scheduled = false
let rafId = 0
const scheduleRefresh = () => {
  if (scheduled) return
  scheduled = true
  rafId = requestAnimationFrame(() => {
    updateActiveNavItem()
    updateIndicatorPosition()
    scheduled = false
  })
}

// 计算活跃的导航项
const currentPath = computed(() => route.path)

// 替换原有 watch：使用单通道调度
watch(currentPath, () => {
  nextTick(() => {
    scheduleRefresh()
  })
}, { immediate: true, flush: 'post' })

// 更新活跃的导航项 - 全面优化版本
const updateActiveNavItem = () => {
  const navLinks = document.querySelectorAll('.VPNavBarMenu .VPNavBarMenuLink')
  const groupButtons = document.querySelectorAll('.VPNavBarMenuGroup .VPNavBarMenuGroupButton')
  let bestMatch = { element: null, score: 0, href: '', type: '', path: route.path }
  
  // 重置所有导航项状态
  navLinks.forEach(link => link.classList.remove('active'))
  groupButtons.forEach(button => button.classList.remove('active'))
  
  // console.log('[NavbarEnhancer] Current path:', route.path)
  
  // 检查顶级导航链接（单级菜单）
  navLinks.forEach(link => {
    const href = link.getAttribute('href')
    if (href) {
      const score = calculateMatchScore(href, route.path)
      // console.log(`[NavbarEnhancer] Top-level link: ${href} -> score: ${score}`)
      
      if (score > bestMatch.score) {
        bestMatch = { element: link, score, href, type: 'top-level', path: route.path }
      }
    }
  })
  
  // 检查下拉菜单组及其子项（多级菜单）
  groupButtons.forEach(groupButton => {
    const group = groupButton.closest('.VPNavBarMenuGroup')
    
    // 查找所有层级的下拉链接
    const allDropdownLinks = group?.querySelectorAll('.VPNavBarMenuGroupItemLink, .VPNavBarMenuGroupItem .VPNavBarMenuGroupItemLink')
    
    if (allDropdownLinks) {
      let groupMaxScore = 0
      let hasMatchingChild = false
      let bestChildMatch = null
      
      allDropdownLinks.forEach(link => {
        const href = link.getAttribute('href')
        if (href) {
          const score = calculateMatchScore(href, route.path)
          // console.log(`[NavbarEnhancer] Dropdown link: ${href} -> score: ${score}`)
          
          if (score > 0) {
            hasMatchingChild = true
            if (score > groupMaxScore) {
              groupMaxScore = score
              bestChildMatch = { href, score }
            }
          }
        }
      })
      
      // 如果下拉菜单中有匹配项，且分数更高，则选择该组
      if (hasMatchingChild && groupMaxScore > bestMatch.score) {
        bestMatch = { 
          element: groupButton, 
          score: groupMaxScore, 
          href: bestChildMatch?.href || 'group', 
          type: 'dropdown-group',
          path: route.path
        }
      }
    }
  })
  
  // 特殊处理：如果没有找到匹配项，尝试基于路径层级进行模糊匹配
  if (bestMatch.score === 0) {
    bestMatch = findFallbackMatch(route.path, navLinks, groupButtons)
  }
  
  // 设置最佳匹配为活跃状态
  if (bestMatch.element && bestMatch.score > 0) {
    // console.log(`[NavbarEnhancer] Best match: ${bestMatch.href} (${bestMatch.type}) -> score: ${bestMatch.score}`)
    bestMatch.element.classList.add('active')
    activeNavItem.value = bestMatch.element
  } else {
    // console.log('[NavbarEnhancer] No matching navigation item found')
    activeNavItem.value = null
  }
}

// 计算路径匹配分数 - 优化版本
const calculateMatchScore = (navHref, currentPath) => {
  // 精确匹配首页
  if (navHref === '/' && currentPath === '/') {
    return 1000
  }
  
  // 排除首页的其他匹配
  if (navHref === '/') {
    return 0
  }
  
  // 移除尾部斜杠进行标准化
  const normalizedNavHref = navHref.replace(/\/$/, '')
  const normalizedCurrentPath = currentPath.replace(/\/$/, '')
  
  // 精确匹配
  if (normalizedNavHref === normalizedCurrentPath) {
    return 900
  }
  
  // 前缀匹配 - 优先级最高
  if (normalizedCurrentPath.startsWith(normalizedNavHref + '/')) {
    // 匹配长度越长，分数越高
    const matchLength = normalizedNavHref.length
    // 额外加分：如果是直接子路径
    const remainingPath = normalizedCurrentPath.substring(normalizedNavHref.length + 1)
    const isDirectChild = !remainingPath.includes('/')
    return matchLength * 15 + (isDirectChild ? 50 : 0)
  }
  
  // 路径包含匹配 - 适用于深层嵌套结构
  const navParts = normalizedNavHref.split('/').filter(p => p)
  const currentParts = normalizedCurrentPath.split('/').filter(p => p)
  
  // 计算连续匹配的路径段
  let consecutiveMatches = 0
  for (let i = 0; i < Math.min(navParts.length, currentParts.length); i++) {
    if (navParts[i] === currentParts[i]) {
      consecutiveMatches++
    } else {
      break
    }
  }
  
  // 如果有连续匹配，给予评分
  if (consecutiveMatches > 0) {
    // 完全匹配导航路径的所有段给高分
    if (consecutiveMatches === navParts.length) {
      return 200 + navParts.length * 30
    }
    // 部分匹配给较低分数
    return consecutiveMatches * 10
  }
  
  // 模糊匹配：检查当前路径是否包含导航路径的关键段
  const navKeySegments = navParts.filter(part => part.length > 2) // 过滤掉太短的段
  let fuzzyScore = 0
  
  navKeySegments.forEach(segment => {
    if (currentParts.includes(segment)) {
      fuzzyScore += 5
    }
  })
  
  return fuzzyScore
}

// 回退匹配策略 - 处理没有直接匹配时的情况（取消硬编码映射）
const findFallbackMatch = (currentPath, navLinks, groupButtons) => {
  const pathParts = currentPath.split('/').filter(p => p)
  let bestFallback = { element: null, score: 0, href: '', type: 'fallback' }
  if (pathParts.length === 0) return bestFallback

  const firstPathSegment = pathParts[0]

  // 优先尝试顶级链接包含该段
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || ''
    if (href.includes(`/${firstPathSegment}/`) || href.endsWith(`/${firstPathSegment}`)) {
      if (bestFallback.score < 40) {
        bestFallback = { element: link, score: 40, href, type: 'fallback-direct' }
      }
    }
  })

  // 其次尝试分组下拉中的任一子项包含该段
  if (bestFallback.score === 0) {
    groupButtons.forEach(groupButton => {
      const group = groupButton.closest('.VPNavBarMenuGroup')
      const allDropdownLinks = group?.querySelectorAll('.VPNavBarMenuGroupItemLink, .VPNavBarMenuGroupItem .VPNavBarMenuGroupItemLink')
      if (allDropdownLinks) {
        for (const link of allDropdownLinks) {
          const href = link.getAttribute('href') || ''
          if (href.includes(`/${firstPathSegment}/`) || href.endsWith(`/${firstPathSegment}`)) {
            bestFallback = { element: groupButton, score: 35, href, type: 'fallback-group' }
            break
          }
        }
      }
    })
  }

  return bestFallback
}

// 强制刷新导航状态
const forceRefreshNavbar = () => {
  // console.log('[NavbarEnhancer] Force refreshing navbar state')
  updateActiveNavItem()
  updateIndicatorPosition()
}

// 更新指示器位置
const updateIndicatorPosition = () => {
  if (!activeNavItem.value || !routeIndicator.value) {
    indicatorStyle.value = {
      width: '0px',
      left: '0px',
      opacity: '0'
    }
    return
  }
  
  const navBar = document.querySelector('.VPNavBar')
  const activeRect = activeNavItem.value.getBoundingClientRect()
  const navRect = navBar?.getBoundingClientRect()
  
  if (navRect) {
    const left = activeRect.left - navRect.left
    const width = activeRect.width
    
    indicatorStyle.value = {
      width: `${width}px`,
      left: `${left}px`,
      opacity: '1',
      transform: 'translateZ(0)' // GPU加速
    }
  }
}

// 处理窗口大小变化
const handleResize = () => {
  updateIndicatorPosition()
}

// 导航项点击动画
const addNavClickAnimation = () => {
  const navLinks = document.querySelectorAll('.VPNavBarMenu .VPNavBarMenuLink, .VPNavBarMenuGroup .VPNavBarMenuGroupButton')
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // 创建点击波纹效果
      const ripple = document.createElement('span')
      ripple.className = 'nav-click-ripple'
      
      const rect = link.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      
      link.style.position = 'relative'
      link.style.overflow = 'hidden'
      link.appendChild(ripple)
      
      // 移除波纹效果
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple)
        }
      }, 600)
    })
  })
}

// 添加导航栏滚动效果
const addScrollEffect = () => {
  let ticking = false
  
  const updateNavBarStyle = () => {
    const scrollY = window.scrollY
    const navbar = document.querySelector('.VPNav')
    
    if (navbar) {
      if (scrollY > 10) {
        navbar.classList.add('scrolled')
        navbar.classList.add('has-scrolled')
        navbar.setAttribute('data-scrolled', 'true')
      } else {
        navbar.classList.remove('scrolled')
        navbar.classList.remove('has-scrolled')
        navbar.setAttribute('data-scrolled', 'false')
      }
    }
    
    ticking = false
  }
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateNavBarStyle)
      ticking = true
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Initial check
  updateNavBarStyle()
  
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    updateActiveNavItem()
    updateIndicatorPosition()
    addNavClickAnimation()

    // 监听导航容器的结构变化，自动刷新
    const navContainer = document.querySelector('.VPNavBar')
    let mo, ro
    if (navContainer && 'MutationObserver' in window) {
      mo = new MutationObserver(() => scheduleRefresh())
      mo.observe(navContainer, { childList: true, subtree: true, attributes: true })
    }
    if (navContainer && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => scheduleRefresh())
      ro.observe(navContainer)
    }

    // 添加滚动效果
    const removeScrollListener = addScrollEffect()
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize, { passive: true })
    
    // 设置全局刷新函数，供其他组件调用
    if (typeof window !== 'undefined') {
      window.__refreshNavbarHighlight = forceRefreshNavbar
    }
    
    // 添加额外的路由变化监听器
    const handlePopstate = () => {
      setTimeout(forceRefreshNavbar, 50)
    }
    window.addEventListener('popstate', handlePopstate)
    
    // 添加页面可见性变化监听
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(forceRefreshNavbar, 100)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // 清理函数
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('popstate', handlePopstate)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      removeScrollListener()
      
      if (mo) mo.disconnect()
      if (ro) ro.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      
      if (typeof window !== 'undefined') {
        delete window.__refreshNavbarHighlight
      }
    })
  })
})
</script>

<style scoped>
.navbar-enhancer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.nav-route-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 1px;
  transition: all var(--vp-animation-duration-normal) cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}
</style>

<style>
/* 全局导航增强样式 */
.VPNav.scrolled {
  backdrop-filter: blur(20px);
  box-shadow: var(--vp-shadow-2);
}

/* 点击波纹效果 */
.nav-click-ripple {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(var(--vp-c-brand-rgb), 0.3);
  transform: scale(0);
  animation: navRipple 0.6s ease-out;
  pointer-events: none;
}

@keyframes navRipple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* 导航项活跃状态增强 */
.VPNavBarMenu .VPNavBarMenuLink.active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  font-weight: 600;
}

.VPNavBarMenuGroup .VPNavBarMenuGroupButton.active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

/* 动画降级 */
@media (prefers-reduced-motion: reduce) {
  .nav-route-indicator {
    transition: none !important;
  }
  
  .nav-click-ripple {
    animation: none !important;
  }
}
</style>