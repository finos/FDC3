import typescript from "@rollup/plugin-typescript";
import resolve, {DEFAULTS as RESOLVE_DEFAULTS} from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import ts from "typescript";

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
];