import path from "node:path";
import url from "node:url";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsx } from "mdsx";
import { preprocessMeltUI } from "@melt-ui/pp";
import { mdsxConfig } from "./mdsx.config.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		mdsx(mdsxConfig),
		vitePreprocess({
			style: {
				css: {
					postcss: path.join(__dirname, "postcss.config.cjs"),
				},
			},
		}),
		preprocessMeltUI(),
	],
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter(),
		alias: {
			"$icons/*": "src/lib/components/icons/*",
			"$content/*": ".velite/*",
		},
	},
};

export default config;
