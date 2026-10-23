# IPPUKU GAMES（イップクゲームズ）

ちょっと一服、ひと勝負。10分以内で遊べるオリジナルのテーブルゲームを集めた、ゲーム集の入口ページ。

- 本番は GitHub のユーザーサイト（`https://suzukicecil.github.io/`）の直下に置く想定。各ゲームは同じドメインの `/<リポジトリ名>/` にある。
- 開発中（`npm run dev`、ポート5182）は、各ゲームの開発サーバーを開く（AlcheRoro 5179・BustedUp 5180・NullHand 5181・LoopLine 5183。`src/games.ts` の `devPort`）。各ゲームの「ゲーム一覧へ」は開発中は `http://localhost:5182/` に戻る。

## 起動

```sh
npm install
npm run dev     # 開発サーバー
npm run build   # dist/ に静的ビルド
```

## ゲームの追加

1. `src/games.ts` の `GAMES` に1件足す（`id` はリポジトリ名、`devPort` は開発サーバーのポート）。
2. `src/components/Covers.tsx` の `COVERS` にカバー絵を足す（なければ汎用の絵）。

- 追加から30日間は NEW の印がつく。
- 「前回あそんだゲーム」はブラウザの localStorage（`hub.recent`）に保存する。

## 共有・ホーム画面

- OGP画像（SNSに貼ったときの画像）とアイコンは `sh scripts/render-images.sh` で書き出す（開発サーバーを起動しておく）。入口の `public/og.png`・アイコンと、隣の各ゲームの `public/og.png` を作る。絵は `src/og/Render.tsx`（開発中だけ `?og=<ID>` / `?icon=any|maskable` で表示）。
- `public/manifest.webmanifest` と `public/sw.js` でホーム画面に追加できる（PWA）。サービスワーカーはサイト全体（各ゲームも）を受け持ち、ページはネット優先、ビルド済みファイルは保存優先。各ゲームも本番では `/sw.js` を登録する。
- プライバシーポリシーは `public/privacy/index.html`。保存するデータや外部サービスを変えたら更新する。
