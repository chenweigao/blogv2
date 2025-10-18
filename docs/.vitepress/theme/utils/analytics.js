export function initAnalytics() {
  try {
    if (typeof window === 'undefined') return false
    if (!import.meta.env.PROD) return false

    const enabled = String(import.meta.env.VITE_ANALYTICS_ENABLED ?? 'true') !== 'false'
    if (!enabled) return false

    const provider = String(import.meta.env.VITE_ANALYTICS_PROVIDER || '').toLowerCase()
    const url = String(import.meta.env.VITE_ANALYTICS_URL || '')
    const siteId = String(import.meta.env.VITE_ANALYTICS_SITE_ID || '')

    if (!provider || !url || !siteId) return false

    const dnt =
      window.doNotTrack === '1' ||
      navigator.doNotTrack === '1' ||
      navigator.msDoNotTrack === '1'
    if (dnt) return false

    if (window.__analytics_opt_out === true) return false

    const script = document.createElement('script')
    script.defer = true

    if (provider === 'plausible') {
      script.src = `${url.replace(/\/+$/, '')}/js/plausible.js`
      script.setAttribute('data-domain', siteId)
    } else if (provider === 'umami') {
      script.src = `${url.replace(/\/+$/, '')}/script.js`
      script.setAttribute('data-website-id', siteId)
      script.setAttribute('data-do-not-track', 'true')
    } else {
      return false
    }

    document.head.appendChild(script)
    return true
  } catch {
    return false
  }
}