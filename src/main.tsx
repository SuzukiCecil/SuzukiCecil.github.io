import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Render } from './og/Render'
import './index.css'

const params = new URLSearchParams(location.search)
// 開発中だけ：OGP画像・アイコン書き出し用の画面（本番のビルドには含まれない）
const imageMode = import.meta.env.DEV && (params.has('og') || params.has('icon'))
if (imageMode) {
  document.documentElement.dataset.theme = 'light'
  if (params.has('icon')) for (const el of [document.documentElement, document.body]) el.style.background = 'transparent'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>{imageMode ? <Render og={params.get('og')} icon={params.get('icon')} /> : <App />}</StrictMode>,
)

// ホーム画面に追加したとき、オフラインでも遊べるようにする（本番だけ）
if (import.meta.env.PROD && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
