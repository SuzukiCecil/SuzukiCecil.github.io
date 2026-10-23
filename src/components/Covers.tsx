import { ArrowLeftRight, Cherry, CircleDot, CircleOff, Crown, Dices, Hand, HandFist, Scissors, Siren, type LucideIcon } from 'lucide-react'
import { createContext, useContext, type ReactNode } from 'react'

/**
 * ゲームごとのカバー絵（4:3）。各ゲームの配色に合わせて描く。
 * 新しいゲームを足したら COVERS に追加する（未登録なら汎用の絵）。
 */

/** cover：枠いっぱいに切り抜く（一覧）／contain：絵を全部見せる（OGP画像） */
const FitContext = createContext<'cover' | 'contain'>('cover')

function Frame({ bg, children, label }: { bg: string; children: ReactNode; label: string }) {
  const fit = useContext(FitContext)
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className="block h-full w-full" preserveAspectRatio={fit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'}>
      {/* contain のとき余白も同じ色で埋まるよう、背景は絵の外まで広げる */}
      <rect x="-400" y="-300" width="1200" height="900" fill={bg} />
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
      <rect x="204" y="106" width="168" height="40" rx="10" fill="#fff" opacity="0.55" />
      {tiles.map((t) =>
        t.x === 2 && t.y === 1 ? null : <rect key={`${t.x}-${t.y}`} x={208 + t.x * 40} y={70 + t.y * 40} width="32" height="32" rx="8" fill={t.c} opacity="0.9" />,
      )}
      {/* 矢印トークン（ゲームと同じ黒丸・白縁の左右矢印）。今は横向きなので、同じ行が取れるライン */}
      <rect x="288" y="110" width="32" height="32" rx="8" fill="#c4b8a5" />
      <circle cx="304" cy="126" r="16" fill="#0f172a" stroke="#fff" strokeWidth="3.5" />
      <ArrowLeftRight x={294} y={116} width={20} height={20} color="#fff" strokeWidth={3} />
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

/**
 * バステッド・アップ：緑のフェルトに、ゲームと同じ見た目の賭場ダイスを3つ（胴元は毎回3つ選んで振る）。
 * 丁半＝チップの目（◎つき）、ルーレット＝供託の目、スロット＝サイレン
 */
type BustedFace = { kind: 'chip' | 'pot'; value: number; star?: boolean } | { kind: 'siren' }
const BUSTED_DICE: { bg: string; ink: string; Icon: LucideIcon; face: BustedFace; x: number; y: number; r: number }[] = [
  { bg: '#f3eee6', ink: '#1c1924', Icon: Dices, face: { kind: 'chip', value: 40, star: true }, x: 84, y: 166, r: -9 },
  { bg: '#c81e1e', ink: '#ffffff', Icon: CircleDot, face: { kind: 'pot', value: 90 }, x: 200, y: 146, r: 5 },
  { bg: '#f59e0b', ink: '#1c1924', Icon: Cherry, face: { kind: 'siren' }, x: 316, y: 168, r: -4 },
]

function BustedFaceMark({ face }: { face: BustedFace }) {
  if (face.kind === 'siren')
    return (
      <g>
        <rect x="-26" y="-26" width="52" height="52" rx="11" fill="#fff" stroke="#dc2626" strokeWidth="3.5" />
        <Siren x={-17} y={-17} width={34} height={34} color="#dc2626" strokeWidth={2.75} />
      </g>
    )
  const label = (
    <text y="9" textAnchor="middle" fontSize="25" fontWeight="900" fontFamily="'M PLUS Rounded 1c', sans-serif" fill={face.kind === 'pot' ? '#000' : '#fff'}>
      {face.value}
    </text>
  )
  return (
    <g>
      {face.kind === 'pot' ? (
        <rect x="-30" y="-24" width="60" height="48" rx="8" fill="#f2c14e" stroke="#000" strokeWidth="3" />
      ) : (
        <circle r="28" fill="#1c1924" stroke="#fff" strokeWidth="3" strokeDasharray="9 5" />
      )}
      {label}
      {face.star && (
        <g transform="translate(26 -24)">
          <circle r="11" fill="#f2c14e" stroke="#000" strokeWidth="2" />
          <Crown x={-7} y={-7} width={14} height={14} color="#000" strokeWidth={3} />
        </g>
      )}
    </g>
  )
}

function BustedUpCover() {
  return (
    <Frame bg="#0f3d2e" label="BUSTED UP! のカバー">
      <ellipse cx="200" cy="160" rx="210" ry="130" fill="#14503c" />
      {BUSTED_DICE.map(({ bg, ink, Icon, face, x, y, r }) => (
        <g key={bg} transform={`translate(${x} ${y}) rotate(${r})`}>
          <rect x="-52" y="-46" width="104" height="104" rx="23" fill="#000" opacity="0.35" />
          {face.kind === 'siren' && <rect x="-60" y="-60" width="120" height="120" rx="28" fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.7" />}
          <rect x="-52" y="-52" width="104" height="104" rx="23" fill={bg} />
          <Icon x={-44} y={-44} width={20} height={20} color={ink} opacity={0.5} />
          <BustedFaceMark face={face} />
        </g>
      ))}
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

/**
 * ループライン：夜の路線図。白いマスに4色の路線がつながった環状線で、1マスだけ空いていて、そこにはまる札が降りてくる。
 * 左上と右下の角が駅（白い丸）。線の端の色は隣のマスと必ず同じ。
 */
const LOOP_COLORS = ['#e5484d', '#2f6fdf', '#f0b400', '#2ea44f']
/** 環状線のマス（5×4 の外周を時計回り）。in/out は線が入る辺と出る辺（0上・1右・2下・3左） */
const LOOP_RING: { x: number; y: number; inS: number; outS: number }[] = (() => {
  const cells: [number, number][] = []
  for (let x = 0; x < 5; x++) cells.push([x, 0])
  for (let y = 1; y < 4; y++) cells.push([4, y])
  for (let x = 3; x >= 0; x--) cells.push([x, 3])
  for (let y = 2; y >= 1; y--) cells.push([0, y])
  const side = (a: [number, number], b: [number, number]) => (b[0] > a[0] ? 1 : b[0] < a[0] ? 3 : b[1] > a[1] ? 2 : 0)
  return cells.map((c, i) => {
    const prev = cells[(i - 1 + cells.length) % cells.length]
    const next = cells[(i + 1) % cells.length]
    return { x: c[0], y: c[1], inS: side(c, prev), outS: side(c, next) }
  })
})()
const LOOP_GAP = 10
/** 境目 k の色（隣り合う境目は必ず違う色。14か所で一周する） */
const loopColor = (k: number) => LOOP_COLORS[(k % LOOP_RING.length) % 4]

function LoopTile({ inS, outS, cIn, cOut, station = false }: { inS: number; outS: number; cIn: string; cOut: string; station?: boolean }) {
  const mid = [
    [26, 0],
    [52, 26],
    [26, 52],
    [0, 26],
  ]
  const [a, b] = [mid[inS], mid[outS]]
  let h0: string, h1: string, m: [number, number]
  if ((inS + outS) % 2 === 0) {
    h0 = `M${a[0]} ${a[1]} L26 26`
    h1 = `M26 26 L${b[0]} ${b[1]}`
    m = [26, 26]
  } else {
    const cx = a[0] === 26 ? b[0] : a[0]
    const cy = a[1] === 26 ? b[1] : a[1]
    m = [cx + (26 - cx) / Math.SQRT2, cy + (26 - cy) / Math.SQRT2]
    const ang = (p: number[]) => Math.atan2(p[1] - cy, p[0] - cx)
    let d = ang(m) - ang(a)
    while (d <= -Math.PI) d += 2 * Math.PI
    while (d > Math.PI) d -= 2 * Math.PI
    const sw = d > 0 ? 1 : 0
    h0 = `M${a[0]} ${a[1]} A26 26 0 0 ${sw} ${m[0]} ${m[1]}`
    h1 = `M${m[0]} ${m[1]} A26 26 0 0 ${sw} ${b[0]} ${b[1]}`
  }
  return (
    <g>
      <rect x="1" y="1" width="50" height="50" rx="6" fill="#f7f5ef" />
      <path d={h0} stroke={cIn} strokeWidth="10" fill="none" />
      <path d={h1} stroke={cOut} strokeWidth="10" fill="none" />
      {station && <circle cx={m[0]} cy={m[1]} r="6" fill="#fff" stroke="#1f2937" strokeWidth="3" />}
    </g>
  )
}

function LoopLineCover() {
  const t = 54
  const ox = 200 - (5 * t) / 2
  const oy = 46
  const gap = LOOP_RING[LOOP_GAP]
  return (
    <Frame bg="#0f1620" label="LOOP LINE のカバー">
      {/* 路線図の盤 */}
      <rect x={ox - 14} y={oy - 14} width={5 * t + 24} height={4 * t + 24} rx="16" fill="#1c2836" />
      {Array.from({ length: 20 }, (_, i) => (
        <rect key={i} x={ox + (i % 5) * t - 1} y={oy + Math.floor(i / 5) * t - 1} width="52" height="52" rx="6" fill="#243446" />
      ))}
      {LOOP_RING.map((c, i) =>
        i === LOOP_GAP ? (
          <rect key={i} x={ox + c.x * t + 1} y={oy + c.y * t + 1} width="48" height="48" rx="6" fill="none" stroke="#ffb020" strokeWidth="3" strokeDasharray="6 5" />
        ) : (
          <g key={i} transform={`translate(${ox + c.x * t - 1} ${oy + c.y * t - 1})`}>
            <LoopTile inS={c.inS} outS={c.outS} cIn={loopColor(i)} cOut={loopColor(i + 1)} station={i === 0 || i === 7} />
          </g>
        ),
      )}
      {/* 空いたマスにはまる札が、手札から降りてくる */}
      <g transform={`translate(${ox + gap.x * t + 8} ${oy + gap.y * t + 26}) rotate(-9 26 26)`}>
        <rect x="-3" y="5" width="56" height="56" rx="8" fill="#000" opacity="0.35" />
        <rect x="-2" y="-2" width="56" height="56" rx="8" fill="none" stroke="#ffb020" strokeWidth="4" />
        <LoopTile inS={gap.inS} outS={gap.outS} cIn={loopColor(LOOP_GAP)} cOut={loopColor(LOOP_GAP + 1)} />
      </g>
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
  LoopLine: LoopLineCover,
  AlcheRoro: AlcheRoroCover,
  BustedUp: BustedUpCover,
  NullHand: NullHandCover,
}

export function Cover({ id, title, fit = 'cover' }: { id: string; title: string; fit?: 'cover' | 'contain' }) {
  const C = COVERS[id]
  return <FitContext.Provider value={fit}>{C ? <C /> : <DefaultCover title={title} />}</FitContext.Provider>
}
