import { defineClientConfig } from 'vuepress/client'
import type { Router } from 'vue-router'

export default defineClientConfig({
  enhance({ router }: { router: Router }) {
    const d: any = document as any
    const supportsViewTransition = typeof d.startViewTransition === 'function'
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 个性化页面切换类型：基于路由的简单映射（可按需扩展为 meta 配置）
    const determinePageTransition = (to: any): string => {
      const p = (to?.path || to?.fullPath || '').toLowerCase()
      if (p === '/' || p.startsWith('/home')) return 'fade'
      if (p.startsWith('/gallery') || p.startsWith('/image') || p.startsWith('/photos')) return 'zoom'
      if (p.startsWith('/posts') || p.startsWith('/blog') || p.startsWith('/article')) return 'slide'
      return 'slide'
    }

    // 在切换前设置个性化页面过渡类型（影响 CSS 与 View Transitions 动画）
    router.beforeEach((to: any, _from: any, next: any) => {
      document.documentElement.dataset.pt = determinePageTransition(to)
      next()
    })

    if (supportsViewTransition && !prefersReducedMotion) {
      // 保持原有包装；CSS 将根据 [data-pt] 与 [data-nav] 应用不同动画
      const wrapWithTransition = (fn: (...args: any[]) => any) => {
        return (...args: any[]) => {
          try {
            document.documentElement.dataset.loading = 'true'
            const vt = d.startViewTransition(() => fn(...args))
            vt?.finished?.catch?.(() => {}).finally?.(() => {
              setTimeout(() => { delete document.documentElement.dataset.loading }, 150)
            })
            return vt
          } catch {
            return fn(...args)
          }
        }
      }
      const originalPush = router.push.bind(router)
      const originalReplace = router.replace?.bind(router) || ((..._args: any[]) => Promise.resolve())
      router.push = wrapWithTransition(originalPush) as any
      router.replace = wrapWithTransition(originalReplace) as any
    } else {
      // 无视图过渡支持的后备：为 .theme-container 切换进入/离开类，CSS 将根据 [data-pt] 与 [data-nav] 差异化
      let themeContainer: HTMLElement | null = null
      const ensureContainer = () => {
        if (!themeContainer) themeContainer = document.querySelector('.theme-container') as HTMLElement
        return themeContainer
      }
      router.beforeEach((_to: any, _from: any, next: any) => {
        const el = ensureContainer()
        if (el) {
          el.classList.remove('page-enter')
          el.classList.add('page-leave')
        }
        next()
      })
      router.afterEach?.(() => {
        const el = ensureContainer()
        if (el) {
          el.classList.remove('page-leave')
          el.classList.add('page-enter')
          setTimeout(() => { el.classList.remove('page-enter') }, 320)
        }
      })
    }

    // 保持现有导航方向标记（forward/backward），以便动画方向化
    const navStack: string[] = (window as any).__vt_nav_stack || []
    router.beforeEach((to: any, _from: any, next: any) => {
      const key = to.fullPath || to.path || ''
      const idx = navStack.indexOf(key)
      if (idx === -1) {
        document.documentElement.dataset.nav = 'forward'
        navStack.push(key)
      } else {
        document.documentElement.dataset.nav = 'backward'
        navStack.length = idx + 1
      }
      ;(window as any).__vt_nav_stack = navStack
      next()
    })

    // 标记导航方向（forward/backward）保持不变
    const navStack: string[] = (window as any).__vt_nav_stack || []
    router.beforeEach((to: any, _from: any, next: any) => {
      const key = to.fullPath || to.path || ''
      const idx = navStack.indexOf(key)
      if (idx === -1) {
        document.documentElement.dataset.nav = 'forward'
        navStack.push(key)
      } else {
        document.documentElement.dataset.nav = 'backward'
        navStack.length = idx + 1
      }
      ;(window as any).__vt_nav_stack = navStack
      next()
    })

    // 统一断开旧观察器，避免堆积
    const disconnectObservers = () => {
      const list = (window as any).__vt_observers as IntersectionObserver[] | undefined
      if (Array.isArray(list)) list.forEach(o => o.disconnect())
      ;(window as any).__vt_observers = []
    }
    const addObserver = (io: IntersectionObserver) => {
      const list = (window as any).__vt_observers as IntersectionObserver[] | undefined
      if (Array.isArray(list)) list.push(io)
      else (window as any).__vt_observers = [io]
    }

    // 滚动方向感：隐藏/显现导航栏（一次性注册）
    if (!(window as any).__vt_scroll && !prefersReducedMotion) {
      ;(window as any).__vt_scroll = true
      let lastY = window.scrollY
      let ticking = false
      const threshold = 12
      const onScroll = () => {
        const run = () => {
          const y = window.scrollY
          if (y > 0) document.documentElement.dataset.header = 'scrolled'
          else delete document.documentElement.dataset.header
          if (Math.abs(y - lastY) > threshold) {
            if (y > lastY) {
              document.documentElement.dataset.header = 'hidden'
            } else {
              document.documentElement.dataset.header = 'visible'
              document.documentElement.dataset.header = 'scrolled'
            }
            lastY = y
          }

          // 更新 TOC 活跃链接：选择最接近视口顶部的标题
          const headingNodes = Array.from(document.querySelectorAll('.theme-container .content__default h2[id], .theme-container .content__default h3[id]')) as HTMLElement[]
          let activeId = ''
          let closest = Number.POSITIVE_INFINITY
          for (const h of headingNodes) {
            const rect = h.getBoundingClientRect()
            const distance = Math.abs(rect.top - 64) // 预留顶部导航高度约 64px
            if (rect.top <= window.innerHeight * 0.5 && distance < closest) {
              closest = distance
              activeId = h.id
            }
          }
          if (activeId) {
            document.querySelectorAll('.table-of-contents a.active, .toc a.active').forEach(el => el.classList.remove('active'))
            const selectors = [
              `.table-of-contents a[href="#${activeId}"]`,
              `.toc a[href="#${activeId}"]`
            ]
            for (const sel of selectors) {
              document.querySelectorAll(sel).forEach(el => el.classList.add('active'))
            }
          }

          ticking = false
        }
        if (!ticking) {
          ticking = true
          requestAnimationFrame(run)
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    if (!prefersReducedMotion) {
      const observeHeadings = () => {
        const headings = Array.from(document.querySelectorAll('.theme-container .content__default h2, .theme-container .content__default h3')) as HTMLElement[]
        if (headings.length === 0) return
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement
            if (entry.isIntersecting) el.classList.add('inview')
            else el.classList.remove('inview')
          }
        }, { root: null, threshold: 0.15 })
        headings.forEach(h => io.observe(h))
        addObserver(io)
      }

      const observeCardsAndItems = () => {
        const targets = Array.from(document.querySelectorAll(
          '.theme-container .article-card, .theme-container .post-card, .theme-container .list .list-item, .theme-container .post-list .post-item'
        )) as HTMLElement[]
        if (targets.length === 0) return
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement
            if (entry.isIntersecting) el.classList.add('inview')
            else el.classList.remove('inview')
          }
        }, { root: null, threshold: 0.1 })
        targets.forEach(t => io.observe(t))
        addObserver(io)
      }

      const observeBlocksAndImages = () => {
        const targets = Array.from(document.querySelectorAll(
          '.theme-container .content__default .custom-block, .theme-container .content__default blockquote, .theme-container .content__default figure, .theme-container .content__default img'
        )) as HTMLElement[]
        if (targets.length === 0) return
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement
            if (entry.isIntersecting) el.classList.add('inview')
            else el.classList.remove('inview')
          }
        }, { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' })
        targets.forEach(t => io.observe(t))
        addObserver(io)
      }

      const observeTocAndSidebarLinks = () => {
        const targets = Array.from(document.querySelectorAll(
          '.theme-container .toc a, .theme-container .table-of-contents a, .table-of-contents a, .theme-container .sidebar a, .sidebar a'
        )) as HTMLElement[]
        if (targets.length === 0) return
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement
            if (entry.isIntersecting) el.classList.add('inview')
            else el.classList.remove('inview')
          }
        }, { root: null, threshold: 0.0 })
        targets.forEach(t => io.observe(t))
        addObserver(io)
      }

      const observeAutoInview = () => {
        const targets = Array.from(document.querySelectorAll('.theme-container .auto-inview, .auto-inview')) as HTMLElement[]
        if (targets.length === 0) return
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement
            if (entry.isIntersecting) el.classList.add('inview')
            else el.classList.remove('inview')
          }
        }, { root: null, threshold: 0.12 })
        targets.forEach(t => io.observe(t))
        addObserver(io)
      }

      const runObservers = () => {
        disconnectObservers()
        observeHeadings()
        observeCardsAndItems()
        observeBlocksAndImages()
        observeTocAndSidebarLinks()
        observeAutoInview()
      }
      if (document.readyState === 'complete') {
        runObservers()
      } else {
        window.addEventListener('load', runObservers, { once: true })
      }
      router.afterEach?.(() => {
        setTimeout(runObservers, 0)
      })
    }
  },
})