import react from "eslint-plugin-react";
import _import from "eslint-plugin-import";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{
		ignores: [
			"**/.github/",
			"**/build/",
			"**/dist/",
			"**/node_modules/",
			"**/*.d.ts",
			"**/*.md",
			"**/yarn.lock",
			"**/package.json",
		],
	},
	...compat.extends("plugin:react/recommended", "prettier"),
	{
		plugins: {
			react,
			import: fixupPluginRules(_import),
			"@typescript-eslint": typescriptEslint,
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.commonjs,
				fdc3: "readonly",
			},

			parser: tsParser,
			ecmaVersion: 2018,
			sourceType: "module",

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		settings: {
			react: {
				version: "detect",
			},
		},

		rules: {
			"react/jsx-uses-vars": 2,
			"class-methods-use-this": 0,
			"no-plusplus": 0,
			"no-undef": 2,
			"prefer-arrow-callback": 1,

			"prefer-destructuring": [
				"warn",
				{
					object: true,
					array: false,
				},
			],

			"quote-props": ["warn", "as-needed"],
			"lines-between-class-members": 1,
			"@typescript-eslint/no-unused-vars": 1,
			"prefer-template": 1,
			"arrow-parens": 1,
			"no-extra-semi": 1,
			"no-shadow": 1,
			"import/first": 1,
			"@typescript-eslint/no-use-before-define": 1,
			"no-redeclare": 1,

			"arrow-body-style": [
				"warn",
				"as-needed",
				{
					requireReturnForObjectLiteral: true,
				},
			],

			"one-var-declaration-per-line": ["warn", "always"],
			"no-mixed-operators": 1,
			"no-multiple-empty-lines": 1,
			"no-multi-spaces": 1,
			"default-case": 1,
			"no-unneeded-ternary": 1,
			"operator-assignment": ["warn", "never"],

			"object-property-newline": [
				"warn",
				{
					allowAllPropertiesOnSameLine: true,
				},
			],

			"new-cap": 1,
			"no-case-declarations": 1,
			"react/prop-types": 0,
			"react/no-string-refs": 0,
		},
	},
	pluginJs.configs.recommended,
	eslintConfigPrettier,
];
