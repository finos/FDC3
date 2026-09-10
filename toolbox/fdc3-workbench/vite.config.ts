/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import path from 'path';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = import.meta.dirname;

// https://vitejs.dev/config/
export default defineConfig({
  base: '/toolbox/fdc3-workbench/',
  build: {
    outDir: 'build',
    // The largest chunk is jsoneditor (~1 MB minified): a monolithic,
    // third-party editor that cannot be split further. It is lazy-loaded via
    // dynamic import (see src/components/common/JsonInput.tsx), so it is not
    // part of the initial page load. The limit is raised to acknowledge this
    // known case and keep the build warning-free.
    chunkSizeWarningLimit: 1100,
    // Split large vendored libraries into separate, cacheable chunks so no
    // single chunk exceeds Vite's 500 kB warning threshold. Groups are
    // evaluated in order; the catch-all 'vendor' group must stay last.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/]+react(?:-dom)?[\\/]/ },
            { name: 'mui', test: /node_modules[\\/]+@mui[\\/]/ },
            { name: 'jsoneditor', test: /node_modules[\\/]+jsoneditor[\\/]/ },
            { name: 'vendor', test: /[\\/]node_modules[\\/]/ },
          ],
        },
      },
    },
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'process.env': 'import.meta.env',
    'global.process': 'globalThis.process',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      path: 'path-browserify',
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  server: { port: 4001 },
});
