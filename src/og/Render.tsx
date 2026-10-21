import { Clock, Users } from 'lucide-react'
import { Cover } from '../components/Covers'
import { Logo } from '../components/Logo'
import { GAMES } from '../games'
import { SITE_CATCH, SITE_KANA, SITE_NAME, SITE_SUB } from '../site'

/**
 * 開発中だけ使う、画像書き出し用の画面（scripts/render-images.sh が Chrome でスクリーンショットする）。
 *   ?og=hub        入口のOGP画像（1200×630）
 *   ?og=<ゲームID>  各ゲームのOGP画像（1200×630）
 *   ?icon=any      ホーム画面のアイコン（正方形）
 *   ?icon=maskable 端末に合わせて丸や角丸に切り抜かれる用（中央80%に収める）
 */
export function Render({ og, icon }: { og: string | null; icon: string | null }) {
  if (icon) return <IconImage maskable={icon === 'maskable'} />
  if (og === 'hub' || !og) return <HubOg />
  const game = GAMES.find((g) => g.id === og)
  return game ? <GameOg id={game.id} /> : <HubOg />
}

const OG = 'relative h-[630px] w-[1200px] overflow-hidden bg-[var(--bg)]'

function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Logo className={small ? 'h-12 w-12' : 'h-24 w-24'} />
      <div className="leading-tight">
        <p className={`font-black tracking-wide ${small ? 'text-2xl' : 'text-6xl'}`}>{SITE_NAME}</p>
        {!small && <p className="mt-1 text-xl font-bold text-[var(--muted)]">{SITE_KANA}</p>}
      </div>
    </div>
  )
}

function HubOg() {
  return (
    <div className={OG} style={{ backgroundImage: 'radial-gradient(var(--bg-dot) 3px, transparent 3px)', backgroundSize: '36px 36px' }}>
      <div className="absolute left-[72px] top-[70px]">
        <Brand />
        <p className="mt-8 text-5xl font-black">{SITE_CATCH}</p>
        <p className="mt-3 text-2xl font-bold text-[var(--muted)]">{SITE_SUB}</p>
      </div>
      <div className="absolute bottom-[56px] left-[72px] flex gap-6">
        {GAMES.map((g) => (
          <div key={g.id} className="w-[320px] overflow-hidden rounded-3xl border-2 border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
            <div className="aspect-[4/3]">
              <Cover id={g.id} title={g.title} />
            </div>
          </div>
        ))}
      </div>
      <p className="absolute right-[72px] top-[86px] rounded-full bg-[var(--accent)] px-6 py-3 text-2xl font-black text-[var(--accent-ink)]">ブラウザで無料</p>
    </div>
  )
}

function GameOg({ id }: { id: string }) {
  const g = GAMES.find((x) => x.id === id)!
  return (
    <div className={`${OG} flex`}>
      <div className="h-full w-[620px] shrink-0">
        <Cover id={g.id} title={g.title} fit="contain" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4 px-12">
        <p className="text-2xl font-bold text-[var(--muted)]">{g.kana}</p>
        <p className="text-6xl font-black leading-tight">{g.title}</p>
        <p className="text-3xl font-black">{g.catch}</p>
        <div className="mt-2 flex flex-col gap-2 text-xl font-bold text-[var(--muted)]">
          <span className="flex items-center gap-2">
            <Clock size={24} /> {g.minutes}
          </span>
          <span className="flex items-center gap-2">
            <Users size={24} /> {g.players}
          </span>
        </div>
        <div className="mt-6 border-t-2 border-[var(--border)] pt-6">
          <Brand small />
        </div>
      </div>
    </div>
  )
}

function IconImage({ maskable }: { maskable: boolean }) {
  return (
    <div className="flex h-[512px] w-[512px] items-center justify-center" style={{ background: maskable ? '#14503c' : 'transparent' }}>
      <Logo className={maskable ? 'h-[330px] w-[330px]' : 'h-[512px] w-[512px]'} />
    </div>
  )
}
