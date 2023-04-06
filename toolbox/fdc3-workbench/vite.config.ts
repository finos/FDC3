import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/toolbox/fdc3-workbench",
	build: {
		outDir: "build",
	},
	define: {
		"process.env": "import.meta.env",
		"process.platform": "({})",
		"global.process": "globalThis.process",
	},
	plugins: [
		react(),
		legacy({
			targets: ["defaults", "not IE 11"],
		}),
		nodePolyfills({
			// Whether to polyfill `node:` protocol imports.
			protocolImports: false,
		}),
	],
	server: { port: 3000 },
});
