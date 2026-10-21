#!/bin/sh
# OGP画像とアイコンを書き出す。先に開発サーバー（npm run dev、ポート5182）を起動しておく。
#   sh scripts/render-images.sh
# 出力：public/ に入口の og.png・アイコン、各ゲームの public/og.png（隣のフォルダ ../<ゲームID>/）
set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL="http://localhost:5182/"
TMP="$(mktemp -d)"

shot() { # shot <クエリ> <幅> <高さ> <出力> [透過]
  bg=""
  [ -n "$5" ] && bg="--default-background-color=00000000"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 $bg \
    --virtual-time-budget=6000 --window-size="$2,$3" --screenshot="$4" "$URL?$1" >/dev/null 2>&1
  echo "$4"
}

shot og=hub 1200 630 public/og.png
for g in AlcheRoro BustedUp NullHand; do
  shot "og=$g" 1200 630 "../$g/public/og.png"
done
shot icon=any 512 512 "$TMP/icon.png" transparent
shot icon=maskable 512 512 "$TMP/maskable.png"

cp "$TMP/icon.png" public/icon-512.png
sips -z 192 192 "$TMP/icon.png" --out public/icon-192.png >/dev/null
cp "$TMP/maskable.png" public/icon-maskable-512.png
sips -z 180 180 "$TMP/maskable.png" --out public/apple-touch-icon.png >/dev/null
ls -la public/*.png
