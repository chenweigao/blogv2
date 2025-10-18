/* Simple cache-first Service Worker for VitePress static assets */
const CACHE_NAME = 'vp-cache-v1'
const ASSET_EXTENSIONS = [
  '.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.woff', '.woff2'
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))
      self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)
  const isGET = req.method === 'GET'
  const isAsset = ASSET_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))
  const isSameOrigin = url.origin === self.location.origin

  if (!isGET || !isSameOrigin) {
    return
  }

  event.respondWith(
    (async () => {
      try {
        // Try cache first for static assets
        if (isAsset) {
          const cache = await caches.open(CACHE_NAME)
          const cached = await cache.match(req)
          if (cached) return cached
          const resp = await fetch(req)
          if (resp && resp.ok) {
            cache.put(req, resp.clone())
          }
          return resp
        }
        // Fallback to network for HTML/docs
        return fetch(req)
      } catch {
        // Optional: return a minimal fallback for offline HTML requests
        return new Response('', { status: 200, headers: { 'Content-Type': 'text/html' } })
      }
    })()
  )
})