import { defineClientConfig } from 'vuepress/client'
import type { Router } from 'vue-router'

export default defineClientConfig({
  enhance({ router }: { router: Router }) {
    if (typeof window === 'undefined') return
    const d: any = document as any
    const supportsViewTransition = typeof d.startViewTransition === 'function'
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!supportsViewTransition || prefersReducedMotion) {
      return
    }

    const wrapWithTransition = (fn: (...args: any[]) => any) => {
      return (...args: any[]) => {
        try {
          const vt = d.startViewTransition(() => fn(...args))
          vt?.finished?.catch?.(() => {})
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
  },
})