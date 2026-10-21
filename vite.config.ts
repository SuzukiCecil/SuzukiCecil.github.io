import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ユーザーサイト（https://suzukicecil.github.io/）の直下に置く前提。各ゲームは /<リポジトリ名>/ で同じドメインに並ぶ
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
