/* Simple cache-first Service Worker for VitePress static assets */
const CACHE_NAME = 'vp-cache-v2'
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
        const cache = await caches.open(CACHE_NAME)
        if (isAsset) {
          // Stale-While-Revalidate：先返回缓存，再后台更新
          const cached = await cache.match(req)
          const networkPromise = fetch(req).then((resp) => {
            if (resp && resp.ok) cache.put(req, resp.clone())
            return resp
          }).catch(() => cached)
          return cached || networkPromise
        } else {
          // 对 HTML/docs 走网络，失败时离线兜底
          try {
            const resp = await fetch(req)
            return resp
          } catch {
            const offline = await cache.match('/offline.html')
            return offline || new Response('', { status: 200, headers: { 'Content-Type': 'text/html' } })
          }
        }
      } catch {
        const cache = await caches.open(CACHE_NAME)
        const offline = await cache.match('/offline.html')
        return offline || new Response('', { status: 200, headers: { 'Content-Type': 'text/html' } })
      }
    })()
  )
})