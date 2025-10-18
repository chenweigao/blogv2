export async function initWebVitals() {
  if (typeof window === 'undefined' || !import.meta.env.PROD) return false
  try {
    const mod = await import('web-vitals')
    const { onCLS, onFID, onLCP, onINP, onTTFB } = mod
    const report = (metric) => {
      // 优先使用分析提供商的自定义事件（若可用）
      try {
        const name = metric.name
        const value = Number(metric.value || 0)
        // Plausible
        if (typeof window.plausible === 'function') {
          window.plausible('web-vital', { props: { name, value } })
        }
        // Umami
        if (typeof window.umami === 'object' && typeof window.umami.track === 'function') {
          window.umami.track('web-vital', { name, value })
        }
      } catch {}
      // 控制台兜底
      try {
        console.log('[WebVitals]', metric.name, metric.value, metric)
      } catch {}
    }
    onCLS(report)
    onFID(report)
    onLCP(report)
    onINP(report)
    onTTFB(report)
    return true
  } catch (e) {
    console.warn('initWebVitals failed:', e?.message || e)
    return false
  }
}