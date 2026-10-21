// IPPUKU GAMES のサービスワーカー。サイト全体（入口と各ゲーム /<ゲームID>/）を受け持つ。
// - ページ（HTML）：まずネットから取り、つながらなければ前に保存したものを出す（更新がすぐ届く）
// - ビルド済みのファイル（/assets/ など、名前に中身のハッシュが入るもの）：保存したものを優先
// - それ以外（画像・アイコンなど）：保存したものをすぐ出し、裏で新しいものに入れ替える
const CACHE = 'ippuku-v1'
const PRECACHE = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const put = async (req, res) => {
  if (res.ok) await (await caches.open(CACHE)).put(req, res.clone())
  return res
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== location.origin) return

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then((res) => put(req, res)).catch(async () => (await caches.match(req)) ?? (await caches.match('/'))))
    return
  }
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(req).then((hit) => hit ?? fetch(req).then((res) => put(req, res))))
    return
  }
  event.respondWith(
    caches.match(req).then((hit) => {
      const fresh = fetch(req).then((res) => put(req, res))
      if (hit) {
        event.waitUntil(fresh.catch(() => {}))
        return hit
      }
      return fresh
    }),
  )
})
