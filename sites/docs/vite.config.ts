import { URL, fileURLToPath } from "node:url";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	assetsInclude: ["**/*.md"],
	server: {
		fs: {
			strict: false,
		},
	},
	optimizeDeps: {
		exclude: ["bits-ui"],
	},
	resolve: {
		alias: [
			{
				find: "contentlayer/generated",
				replacement: fileURLToPath(new URL("./.contentlayer/generated", import.meta.url)),
			},
		],
	},
});
