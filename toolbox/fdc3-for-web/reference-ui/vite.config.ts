import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 4002 },
  build: {
    outDir: 'dist',
  },
});
