import path from 'path';
import inject from '@rollup/plugin-inject';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  build: {
    outDir: 'dist/lib',
    sourcemap: true,
    rollupOptions: {
      plugins: [
        inject({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
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
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global.process': 'globalThis.process',
  },
  plugins: [
    cssInjectedByJsPlugin(),
    {
      name: 'fix-source-map-support-global',
      transform(code, id) {
        if (id.includes('browser-source-map-support')) {
          return code.replace(
            '(this.define||function(R,U){this.sourceMapSupport=U()})',
            '(globalThis.define||function(R,U){globalThis.sourceMapSupport=U()})'
          );
        }
      },
    },
  ],
});
