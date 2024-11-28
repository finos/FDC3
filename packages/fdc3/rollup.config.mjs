import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";


export default [

    {
        input: "src/index.ts",

        // Property inherited from TSDX. To understand what this is doing, see comments:
        // https://github.com/jaredpalmer/tsdx/blob/master/src/createRollupConfig.ts#L77
        treeshake: {
            propertyReadSideEffects: false
        },

        output: {
            file: "dist/index.cjs",
            format: "cjs",
            freeze: false,
            esModule: false,
            sourcemap: true,
            exports: "named",
        },

        plugins: [
            nodeResolve(),
            // resolve({
            //     mainFields: ['module', 'main', "browser"],
            //     extensions: [...RESOLVE_DEFAULTS.extensions, '.cjs', '.mjs', '.jsx'],
            // }),
            // all bundled external modules need to be converted from CJS to ESM
            commonjs({
                // use a regex to make sure to include eventual hoisted packages
                include: /\/regenerator-runtime\//,
            }),
            json(),
            typescript(),
        ]
    }

];