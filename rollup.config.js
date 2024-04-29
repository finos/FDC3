import typescript from "@rollup/plugin-typescript";
import resolve, {DEFAULTS as RESOLVE_DEFAULTS} from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

const devProdGlue = `if (process.env.NODE_ENV === 'production') {
  module.exports = require('./fdc3.cjs.production.min.js');
} else {
  module.exports = require('./fdc3.cjs.development.js');
}`;

export default [

    // Development CJS files
    {
        input: "src/index.ts",

        // Property inherited from TSDX. To understand what this is doing, see comments:
        // https://github.com/jaredpalmer/tsdx/blob/master/src/createRollupConfig.ts#L77
        treeshake: {
            propertyReadSideEffects: false
        },

        output: {
            file: "dist/fdc3.cjs.development.js",
            format: "cjs",
            freeze: false,
            esModule: true,
            name: "@finos/fdc3",
            sourcemap: true,
            globals: {
                react: "React",
                "react-native": "ReactNative"
            },
            exports: "named",
        },

        plugins: [
            resolve({
                mainFields: ['module', 'main', "browser"],
                extensions: [...RESOLVE_DEFAULTS.extensions, '.cjs', '.mjs', '.jsx'],
            }),
            // all bundled external modules need to be converted from CJS to ESM
            commonjs({
                // use a regex to make sure to include eventual hoisted packages
                include: /\/regenerator-runtime\//,
            }),
            json(),
            typescript(),
        ]
    },

    // Production CJS files
    {
        input: "src/index.ts",

        // Property inherited from TSDX. To understand what this is doing, see comments:
        // https://github.com/jaredpalmer/tsdx/blob/master/src/createRollupConfig.ts#L77
        treeshake: {
            propertyReadSideEffects: false
        },

        output: {
            file: "dist/fdc3.cjs.production.min.js",
            format: "cjs",
            freeze: false,
            esModule: true,
            name: "@finos/fdc3",
            sourcemap: true,
            globals: {
                react: "React",
                "react-native": "ReactNative"
            },
            exports: "named",
        },

        plugins: [
            resolve({
                mainFields: ['module', 'main', "browser"],
                extensions: [...RESOLVE_DEFAULTS.extensions, '.cjs', '.mjs', '.jsx'],
            }),
            // all bundled external modules need to be converted from CJS to ESM
            commonjs({
                // use a regex to make sure to include eventual hoisted packages
                include: /\/regenerator-runtime\//,
            }),
            json(),
            typescript(),
            replace({
                preventAssignment: true,
                "process.env.NODE_ENV": "production"
            }),
            terser({
                output: {
                    comments: false
                },
                compress: {
                    keep_infinity: true,
                    pure_getters: true,
                    passes: 10
                },
                ecma: 2020,
                module: false,
                toplevel: true,
                warnings: true
            })
        ]
    },

    // ESM files
    {
        input: "src/index.ts",

        // Property inherited from TSDX. To understand what this is doing, see comments:
        // https://github.com/jaredpalmer/tsdx/blob/master/src/createRollupConfig.ts#L77
        treeshake: {
            propertyReadSideEffects: false
        },

        output: {
            file: "dist/fdc3.esm.js",
            format: "esm",
            freeze: false,
            esModule: true,
            name: "@finos/fdc3",
            sourcemap: true,
            globals: {
                react: "React",
                "react-native": "ReactNative"
            },
            exports: "named",
        },

        plugins: [
            resolve({
                mainFields: ['module', 'main', "browser"],
                extensions: [...RESOLVE_DEFAULTS.extensions, '.cjs', '.mjs', '.jsx'],
            }),
            // all bundled external modules need to be converted from CJS to ESM
            commonjs({
                // use a regex to make sure to include eventual hoisted packages
                include: /\/regenerator-runtime\//,
            }),
            json(),
            typescript(),
        ]
    },

    // Glue for Dev v Prod environments
    {
        input: "src/index.ts",  // We don't use the input string, but rollup requires that an `input` be specified
        output: {
            file: "dist/index.js",
            format: "cjs"   // This adds `"use strict"` to the top of index.js
        },
        plugins: [
            {
                name: "dev-prod-glue",
                load(){
                    return devProdGlue;
                }
            }
        ]
    }
];