import process from "node:process";
import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";

const vitestBrowserConditionPlugin: Plugin = {
	name: "vite-plugin-vitest-browser-condition",
	//@ts-expect-error - idk
	config({ resolve }: { resolve: { conditions: string[] } }) {
		if (process.env.VITEST) {
			resolve.conditions.unshift("browser");
		}
	},
};

export default defineConfig({
	plugins: [vitestBrowserConditionPlugin, sveltekit(), svelteTesting()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		// jest like globals
		globals: true,
		environment: "jsdom",
		// in-source testing
		includeSource: ["src/**/*.{js,ts,svelte}"],
		// Add @testing-library/jest-dom's matchers & mocks of SvelteKit modules
		setupFiles: ["./other/setup-test.ts"],
		coverage: {
			exclude: ["./other/setup-test.ts"],
		},
	},
});
