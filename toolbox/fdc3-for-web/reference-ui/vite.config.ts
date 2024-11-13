import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	server: { port: 4000 },
	build: {
		outDir: "../../../website/static/reference-ui"
	}
});
