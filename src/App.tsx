import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Play, Sparkles, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Cover } from './components/Covers'
import { GAMES, GENRES, gameUrl, isNew, type Game } from './games'

/** 仮の名前（決まったらここと index.html を変える） */
const SITE_NAME = 'あそびのテーブル'

const RECENT_KEY = 'hub.recent'
function loadRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}
function saveRecent(ids: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids))
  } catch {
    // 保存できない環境でも遊べる
  }
}

export default function App() {
  const [open, setOpen] = useState<Game | null>(null)
  const [recent, setRecent] = useState<string[]>(loadRecent)

  const lastPlayed = recent.map((id) => GAMES.find((g) => g.id === id)).filter((g): g is Game => !!g)[0]

  const play = (g: Game) => {
    const next = [g.id, ...recent.filter((x) => x !== g.id)].slice(0, 5)
    setRecent(next)
    saveRecent(next)
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-8">
      <header className="pb-4 pt-6 sm:pt-10">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="leading-tight">
            <h1 className="text-2xl font-black tracking-wide sm:text-3xl">{SITE_NAME}</h1>
            <p className="text-sm font-bold text-[var(--muted)]">10分で遊べる、テーブルゲームの小箱</p>
          </div>
        </div>
      </header>

      {lastPlayed && (
        <section aria-label="前回あそんだゲーム" className="mb-4">
          <button
            type="button"
            onClick={() => setOpen(lastPlayed)}
            className="flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-2 pr-4 text-left shadow-[var(--shadow)] transition hover:-translate-y-0.5"
          >
            <span className="h-14 w-[75px] shrink-0 overflow-hidden rounded-xl">
              <Cover id={lastPlayed.id} title={lastPlayed.title} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[var(--muted)]">前回あそんだゲーム</span>
              <span className="block truncate font-black">{lastPlayed.title}</span>
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[var(--accent)] px-3 py-1.5 text-sm font-black text-[var(--accent-ink)]">
              <Play size={14} fill="currentColor" /> つづける
            </span>
          </button>
        </section>
      )}

      <main>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {GAMES.map((g) => (
            <li key={g.id}>
              <GameTile game={g} onOpen={() => setOpen(g)} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs font-bold text-[var(--muted)]">ゲームは少しずつ増えていきます</p>
      </main>

      <footer className="mt-auto pt-10 text-center text-[11px] text-[var(--muted)]">すべてのゲームはブラウザだけで遊べます（登録・課金なし）</footer>

      <GameSheet game={open} onClose={() => setOpen(null)} onPlay={play} />
    </div>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="h-12 w-12 shrink-0 drop-shadow-sm">
      <rect x="2" y="6" width="44" height="38" rx="10" fill="var(--wood)" />
      <rect x="2" y="6" width="44" height="32" rx="10" fill="#14503c" />
      <rect x="9" y="12" width="16" height="22" rx="3" fill="#fffaf2" transform="rotate(-8 17 23)" />
      <rect x="25" y="15" width="15" height="15" rx="4" fill="#e8743b" />
      <circle cx="29.5" cy="19.5" r="1.8" fill="#fff" />
      <circle cx="35.5" cy="25.5" r="1.8" fill="#fff" />
      <circle cx="32.5" cy="22.5" r="1.8" fill="#fff" />
    </svg>
  )
}

function GameTile({ game, onOpen }: { game: Game; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] text-left shadow-[var(--shadow)] transition hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-[var(--accent)]"
    >
      <span className="relative block aspect-[4/3] overflow-hidden">
        <span className="block h-full w-full transition duration-300 group-hover:scale-105">
          <Cover id={game.id} title={game.title} />
        </span>
        {isNew(game) && (
          <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[11px] font-black text-[var(--accent-ink)] shadow">
            <Sparkles size={11} /> NEW
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[11px] font-bold text-[var(--muted)]">{game.kana}</span>
        <span className="text-base font-black leading-tight sm:text-lg">{game.title}</span>
        <span className="text-xs leading-snug text-[var(--muted)]">{game.catch}</span>
        <span className="mt-auto flex flex-wrap gap-x-2 gap-y-0.5 pt-1 text-[11px] font-bold text-[var(--muted)]">
          <span className="flex items-center gap-0.5">
            <Clock size={12} /> {game.minutes}
          </span>
          <span className="flex items-center gap-0.5">
            <Users size={12} /> {game.players}
          </span>
        </span>
      </span>
    </button>
  )
}

function GameSheet({ game, onClose, onPlay }: { game: Game | null; onClose: () => void; onPlay: (g: Game) => void }) {
  useEffect(() => {
    if (!game) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [game, onClose])

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[2px] sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={game.title}
            className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[var(--panel)] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Cover id={game.id} title={game.title} />
              <button
                type="button"
                aria-label="閉じる"
                onClick={onClose}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-5 pt-4">
              <p className="text-xs font-bold text-[var(--muted)]">
                {GENRES[game.genre]}ゲーム・{game.kana}
              </p>
              <h2 className="text-2xl font-black leading-tight">{game.title}</h2>
              <p className="mt-1 font-bold">{game.catch}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{game.description}</p>

              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Info icon={<Clock size={16} />} label="時間" value={game.minutes} />
                <Info icon={<Users size={16} />} label="人数" value={game.players} />
                <Info icon={<Sparkles size={16} />} label="CPU" value="3段階の強さ" />
              </dl>

              <h3 className="mt-5 text-sm font-black">あそびかた</h3>
              <ol className="mt-2 space-y-2">
                {game.rules.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--card)] text-[11px] font-black">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ol>

              <a
                href={gameUrl(game)}
                onClick={() => onPlay(game)}
                className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-3.5 text-lg font-black text-[var(--accent-ink)] shadow-[0_4px_0_var(--wood-dark)] transition hover:brightness-105 active:translate-y-0.5 active:shadow-[0_2px_0_var(--wood-dark)]"
              >
                <Play size={20} fill="currentColor" /> あそぶ
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--card)] px-1 py-2">
      <dt className="flex items-center justify-center gap-1 text-[11px] font-bold text-[var(--muted)]">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 text-xs font-black leading-tight">{value}</dd>
    </div>
  )
}
