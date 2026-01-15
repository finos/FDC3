import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',

    // Property inherited from TSDX. To understand what this is doing, see comments:
    // https://github.com/jaredpalmer/tsdx/blob/master/src/createRollupConfig.ts#L77
    treeshake: {
      propertyReadSideEffects: false,
    },

    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      freeze: false,
      esModule: false,
      sourcemap: true,
      exports: 'named',
    },

    plugins: [
      nodeResolve(),
      commonjs({
        // use a regex to make sure to include eventual hoisted packages (RM:  what is this?)
        include: /\/regenerator-runtime\//,
      }),
      json(),
    ],
  },
  {
    input: './src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts({ respectExternal: true })],
  },
];
