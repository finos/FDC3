import path from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  build: {
    outDir: 'dist/lib',
    sourcemap: true,
    rollupOptions: {
      input: {
        'fdc3-compliance': path.resolve(__dirname, './src/test/index.ts'),
        channel: path.resolve(__dirname, './src/mock/channel.ts'),
        general: path.resolve(__dirname, './src/mock/general.ts'),
        metadata: path.resolve(__dirname, './src/mock/metadata.ts'),
        'intent-a': path.resolve(__dirname, './src/mock/intent-a.ts'),
        'intent-b': path.resolve(__dirname, './src/mock/intent-b.ts'),
        'intent-c': path.resolve(__dirname, './src/mock/intent-c.ts'),
        'intent-d': path.resolve(__dirname, './src/mock/intent-d.ts'),
        'intent-e': path.resolve(__dirname, './src/mock/intent-e.ts'),
        'intent-f': path.resolve(__dirname, './src/mock/intent-f.ts'),
        'intent-g': path.resolve(__dirname, './src/mock/intent-g.ts'),
        'intent-h': path.resolve(__dirname, './src/mock/intent-h.ts'),
        'intent-i': path.resolve(__dirname, './src/mock/intent-i.ts'),
        'intent-j': path.resolve(__dirname, './src/mock/intent-j.ts'),
        'intent-k': path.resolve(__dirname, './src/mock/intent-k.ts'),
        'intent-l': path.resolve(__dirname, './src/mock/intent-l.ts'),
        basic: path.resolve(__dirname, './src/mock/basic.ts'),
        'open-a': path.resolve(__dirname, './src/mock/open-a.ts'),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'process.env': 'import.meta.env',
    'global.process': 'globalThis.process',
  },
  plugins: [cssInjectedByJsPlugin()],
});
