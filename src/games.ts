/** ゲーム集に並べるゲームの一覧。新しいゲームはここに足す（カバー絵は components/Covers.tsx） */

export type Genre = 'board' | 'dice' | 'card'

export const GENRES: Record<Genre, string> = {
  board: 'ボード',
  dice: 'ダイス',
  card: 'カード',
}

export interface Game {
  /** リポジトリ名。公開先は https://suzukicecil.github.io/<id>/ */
  id: string
  title: string
  kana: string
  /** 一覧に出す一言 */
  catch: string
  /** 詳細に出す紹介文 */
  description: string
  /** 遊び方の要点（3つ程度） */
  rules: string[]
  genre: Genre
  minutes: string
  players: string
  /** 追加した日（新着の印に使う） */
  added: string
}

export const GAMES: Game[] = [
  {
    id: 'NullHand',
    title: 'NULL-HAND',
    kana: 'ヌルハンド',
    catch: '2枚見せて、1枚で勝負。',
    description: '限られた手札を読み合う、CPUとの心理戦じゃんけん。手札の半分は、何にも勝てない「ヌル」。いつ捨て、いつ勝負に出るか。',
    rules: [
      '手札はグー・チョキ・パー各2枚と、すべてに負けるヌル6枚',
      '毎ラウンド2枚を見せ合い、そのうち1枚を同時に選んで勝負',
      '先に3勝した方の勝ち。使った札は戻らない',
    ],
    genre: 'card',
    minutes: '3〜5分',
    players: 'CPUと1対1',
    added: '2026-10-20',
  },
  {
    id: 'BustedUp',
    title: 'BUSTED UP!',
    kana: 'バステッド・アップ',
    catch: '摘発の前に、勝ち逃げしろ。',
    description: '地下カジノを舞台にしたダイスゲーム。振るたびにチップは増えるが、サイレンが2つ鳴れば全部没収。残るか、席を立つか。',
    rules: [
      '胴元が賭場ダイスを3つ振り、チップと供託が積み上がる',
      'サイレンの目が2つ以上出ると摘発。席に残った全員が没収',
      '振るたびに全員が同時に「残る／立つ」を宣言する',
    ],
    genre: 'dice',
    minutes: '10分前後',
    players: 'あなた＋CPU2〜3人',
    added: '2026-10-20',
  },
  {
    id: 'AlcheRoro',
    title: 'AlcheRoro',
    kana: 'アルケロロ',
    catch: '素材を集めて、薬を調合。',
    description: '6×6の盤から素材タイルを取り、調合カードを完成させて6点を目指す。取れる場所は矢印しだい。相手に渡すマスまで読み合う。',
    rules: [
      '矢印が指す列のタイルを1枚取ると、矢印はそこへ移って90度回る',
      '素材がそろったら調合カードを作って得点（同じ素材3個で好きな素材1個の代わり）',
      '先に6点で勝ち。取れるタイルがなくなったら得点の多い方の勝ち',
    ],
    genre: 'board',
    minutes: '10分前後',
    players: 'CPUと1対1',
    added: '2026-10-19',
  },
]

/** 開発中は公開済みのゲームを開く。本番は同じドメインの /<id>/ */
export const gameUrl = (g: Game) => `${import.meta.env.DEV ? 'https://suzukicecil.github.io' : ''}/${g.id}/`

/** 追加から30日以内なら新着 */
export const isNew = (g: Game, now = Date.now()) => now - new Date(g.added).getTime() < 30 * 24 * 60 * 60 * 1000
