# あそびのテーブル（仮）

10分以内で遊べるテーブルゲームを集めた、ゲーム集の入口ページ。

- 本番は GitHub のユーザーサイト（`https://suzukicecil.github.io/`）の直下に置く想定。各ゲームは同じドメインの `/<リポジトリ名>/` にある。
- 開発中（`npm run dev`）は、ゲームへのリンクが公開済みの `https://suzukicecil.github.io/<リポジトリ名>/` を開く。

## 起動

```sh
npm install
npm run dev     # 開発サーバー
npm run build   # dist/ に静的ビルド
```

## ゲームの追加

1. `src/games.ts` の `GAMES` に1件足す（`id` はリポジトリ名）。
2. `src/components/Covers.tsx` の `COVERS` にカバー絵を足す（なければ汎用の絵）。

- 追加から30日間は NEW の印がつく。
- 「前回あそんだゲーム」はブラウザの localStorage（`hub.recent`）に保存する。
