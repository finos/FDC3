import path from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const __dirname = import.meta.dirname;

const SOURCE_MAP_SUPPORT_GLOBAL = '(this.define||function(R,U){this.sourceMapSupport=U()})';
const SOURCE_MAP_SUPPORT_GLOBAL_FIXED = '(globalThis.define||function(R,U){globalThis.sourceMapSupport=U()})';

/**
 * A line-preserving identity sourcemap for `code`.
 *
 * The transform below rewrites a single expression and never adds or removes a line, so mapping
 * the start of every output line to the start of the same input line is accurate. Returning it
 * keeps the bundler from warning that the plugin dropped the sourcemap.
 */
function identitySourceMap(code: string, id: string) {
  const lineCount = code.split('\n').length;
  // VLQ segments: `AAAA` = [col 0, source 0, line 0, col 0]; `AACA` advances the source line by 1.
  const mappings = ['AAAA', ...Array(Math.max(lineCount - 1, 0)).fill('AACA')].join(';');
  return { version: 3 as const, sources: [id], sourcesContent: [code], names: [], mappings };
}

export default defineConfig({
  build: {
    outDir: 'dist/lib',
    sourcemap: true,
    rollupOptions: {
      transform: {
        inject: {
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer'],
        },
      },
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
    cssInjectedByJsPlugin({
      // Only the `fdc3-compliance` entry imports CSS (mocha.css); without this the plugin
      // picks an arbitrary entry among the many mock apps.
      jsAssetsFilterFunction: outputChunk => outputChunk.fileName === 'fdc3-compliance.js',
    }),
    {
      name: 'fix-source-map-support-global',
      transform(code, id) {
        if (!id.includes('browser-source-map-support')) {
          return;
        }
        if (!code.includes(SOURCE_MAP_SUPPORT_GLOBAL)) {
          return;
        }
        // The replacement is confined to one line, so line numbers are unchanged.
        return {
          code: code.replace(SOURCE_MAP_SUPPORT_GLOBAL, SOURCE_MAP_SUPPORT_GLOBAL_FIXED),
          map: identitySourceMap(code, id),
        };
      },
    },
  ],
});
