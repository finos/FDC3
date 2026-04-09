/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  build: {
    outDir: 'dist/lib',
    rollupOptions: {
      input: {
        'fdc3-compliance': './src/test/index.ts',
        channel: './src/mock/channel.ts',
        general: './src/mock/general.ts',
        metadata: './src/mock/metadata.ts',
        'intent-a': './src/mock/intent-a.ts',
        'intent-b': './src/mock/intent-b.ts',
        'intent-c': './src/mock/intent-c.ts',
        'intent-d': './src/mock/intent-d.ts',
        'intent-e': './src/mock/intent-e.ts',
        'intent-f': './src/mock/intent-f.ts',
        'intent-g': './src/mock/intent-g.ts',
        'intent-h': './src/mock/intent-h.ts',
        'intent-i': './src/mock/intent-i.ts',
        'intent-j': './src/mock/intent-j.ts',
        'intent-k': './src/mock/intent-k.ts',
        basic: './src/mock/basic.ts',
        'open-a': './src/mock/open-a.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        format: 'es',
      },
    },
  },
  plugins: [nodePolyfills(), cssInjectedByJsPlugin()],
});
