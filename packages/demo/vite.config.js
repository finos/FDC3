import { defineConfig } from 'vite'
import mix from 'vite-plugin-mix'

export default defineConfig({
  plugins: [
    mix({
      handler: './api.js',
    }),
  ],
})