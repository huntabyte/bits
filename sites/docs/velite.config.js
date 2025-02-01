import { defineConfig, s } from "velite";

const sharedSchema = s
	.object({
		title: s.string(),
		description: s.string(),
		path: s.path(),
		content: s.markdown(),
		navLabel: s.string().optional(),
		raw: s.raw(),
	})
	.transform((data) => {
		return {
			...data,
			slug: data.path.split("/").slice(1).join("/"),
			slugFull: `/${data.path}`,
		};
	});

export default defineConfig({
	collections: {
		docs: {
			name: "Doc",
			pattern: "./*.md",
			schema: sharedSchema,
		},
		componentDocs: {
			name: "ComponentDoc",
			pattern: "./components/**/*.md",
			schema: sharedSchema,
		},
		utilityDocs: {
			name: "UtilityDoc",
			pattern: "./utilities/**/*.md",
			schema: sharedSchema,
		},
		typeHelperDocs: {
			name: "TypeHelperDoc",
			pattern: "./type-helpers/**/*.md",
			schema: sharedSchema,
		},
	},
});
