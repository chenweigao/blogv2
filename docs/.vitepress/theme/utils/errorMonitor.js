export function initErrorMonitor() {
  if (typeof window === 'undefined' || !import.meta.env.PROD) return false
  const sampling = Number(import.meta.env.VITE_ERROR_SAMPLING_RATE ?? 0.1)
  const shouldSample = () => Math.random() < sampling

  const onError = (event) => {
    try {
      if (!shouldSample()) return
      const payload = {
        type: 'error',
        message: event?.message || '',
        source: event?.filename || '',
        lineno: event?.lineno || 0,
        colno: event?.colno || 0,
        stack: event?.error?.stack || '',
        time: new Date().toISOString()
      }
      // 这里保守地仅做 console 记录；如需上报，可集成至分析提供商或自建端点
      console.error('[Monitor] JS Error:', payload)
    } catch {}
  }

  const onRejection = (event) => {
    try {
      if (!shouldSample()) return
      const payload = {
        type: 'unhandledrejection',
        reason: String(event?.reason ?? ''),
        stack: event?.reason?.stack || '',
        time: new Date().toISOString()
      }
      console.error('[Monitor] Unhandled Rejection:', payload)
    } catch {}
  }

  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)
  return true
}