import { CircleOff, Hand, HandFist, Scissors, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * ゲームごとのカバー絵（4:3）。各ゲームの配色に合わせて描く。
 * 新しいゲームを足したら COVERS に追加する（未登録なら汎用の絵）。
 */

function Frame({ bg, children, label }: { bg: string; children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className="block h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill={bg} />
      {children}
    </svg>
  )
}

/** アルケロロ：調合カードの絵と、素材タイルの盤 */
function AlcheRoroCover() {
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7']
  const tiles = Array.from({ length: 16 }, (_, i) => ({ x: i % 4, y: Math.floor(i / 4), c: colors[(i * 7 + 3) % 5] }))
  return (
    <Frame bg="#efe7da" label="AlcheRoro のカバー">
      <rect x="196" y="58" width="176" height="176" rx="18" fill="#d9cfbf" />
      {tiles.map((t) =>
        t.x === 2 && t.y === 1 ? null : <rect key={`${t.x}-${t.y}`} x={208 + t.x * 40} y={70 + t.y * 40} width="32" height="32" rx="8" fill={t.c} opacity="0.9" />,
      )}
      {/* 空きマスの矢印トークン */}
      <path d="M304 112l13 24h-26z" fill="#2a2420" />
      <g transform="rotate(-8 120 150)">
        <rect x="40" y="40" width="150" height="210" rx="14" fill="#fff" stroke="#6d28d9" strokeWidth="6" />
        <image href={`${import.meta.env.BASE_URL}covers/alcheroro.jpg`} x="49" y="49" width="132" height="132" preserveAspectRatio="xMidYMid slice" />
        <circle cx="78" cy="214" r="11" fill="#ef4444" />
        <circle cx="106" cy="214" r="11" fill="#3b82f6" />
        <circle cx="134" cy="214" r="11" fill="#eab308" />
      </g>
    </Frame>
  )
}

/** バステッド・アップ：緑のフェルトにダイスとチップ、サイレン */
function BustedUpCover() {
  return (
    <Frame bg="#0f3d2e" label="BUSTED UP! のカバー">
      <circle cx="200" cy="150" r="190" fill="#14503c" />
      <g fill="#f2c14e" stroke="#8a6a1c" strokeWidth="4">
        <ellipse cx="300" cy="226" rx="44" ry="14" />
        <ellipse cx="300" cy="212" rx="44" ry="14" />
        <ellipse cx="300" cy="198" rx="44" ry="14" />
      </g>
      <g transform="rotate(-14 130 150)">
        <rect x="70" y="90" width="120" height="120" rx="22" fill="#f3eee6" />
        <circle cx="105" cy="125" r="13" fill="#1c1924" />
        <circle cx="155" cy="175" r="13" fill="#1c1924" />
        <circle cx="130" cy="150" r="13" fill="#ef4444" />
      </g>
      <g transform="rotate(10 250 110)">
        <rect x="200" y="60" width="96" height="96" rx="18" fill="#f2c14e" />
        <rect x="226" y="86" width="44" height="44" rx="8" fill="#1c1924" />
      </g>
      <g transform="translate(330 70)">
        <circle r="30" fill="#fff" stroke="#ef4444" strokeWidth="6" />
        <path d="M-12 10v-8a12 12 0 0 1 24 0v8z M-16 10h32v6h-32z" fill="#ef4444" />
      </g>
    </Frame>
  )
}

/** ヌルハンド：ゲームに出てくる4種類の札（グー・チョキ・パー・ヌル）を扇形に。絵柄はゲームと同じアイコン */
const NULL_HAND_CARDS: { Icon: LucideIcon; label: string }[] = [
  { Icon: HandFist, label: 'グー' },
  { Icon: Scissors, label: 'チョキ' },
  { Icon: Hand, label: 'パー' },
  { Icon: CircleOff, label: 'NULL' },
]

function NullHandCover() {
  return (
    <Frame bg="#0b0b0d" label="NULL-HAND のカバー">
      <ellipse cx="200" cy="290" rx="220" ry="90" fill="#22d3ee" opacity="0.08" />
      {NULL_HAND_CARDS.map(({ Icon, label }, i) => (
        <g key={label} transform={`rotate(${(i - 1.5) * 8.5} 200 700)`}>
          <rect x="157" y="88" width="86" height="124" rx="12" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="3" />
          <Icon x={176} y={106} width={48} height={48} color="#18181b" strokeWidth={2.2} />
          <text x="200" y="188" textAnchor="middle" fontSize="15" fontWeight="900" fill="#18181b" fontFamily="'M PLUS Rounded 1c', sans-serif" letterSpacing="1">
            {label}
          </text>
        </g>
      ))}
    </Frame>
  )
}

function DefaultCover({ title }: { title: string }) {
  return (
    <Frame bg="#e8743b" label={`${title} のカバー`}>
      <text x="200" y="165" textAnchor="middle" fontSize="40" fontWeight="900" fill="#fff" fontFamily="sans-serif">
        {title}
      </text>
    </Frame>
  )
}

const COVERS: Record<string, () => ReactNode> = {
  AlcheRoro: AlcheRoroCover,
  BustedUp: BustedUpCover,
  NullHand: NullHandCover,
}

export function Cover({ id, title }: { id: string; title: string }) {
  const C = COVERS[id]
  return C ? <C /> : <DefaultCover title={title} />
}
