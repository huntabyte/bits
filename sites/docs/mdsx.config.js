/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { readFileSync } from "node:fs";
import path, { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import prettier from "@prettier/sync";
import { defineConfig } from "mdsx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getHighlighter } from "shiki";
import { u } from "unist-builder";
import { visit } from "unist-util-visit";
import { codeBlockPrettierConfig } from "./other/code-block-prettier.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('unified').Transformer<HastRoot, HastRoot>} HastTransformer
 * @typedef {import('unified').Transformer<MdastRoot, MdastRoot>} MdastTransformer
 */

/**
 * @type {import('rehype-pretty-code').Options}
 */
const prettyCodeOptions = {
	theme: {
		dark: JSON.parse(
			String(
				readFileSync(
					resolve(__dirname, "./src/lib/styles/themes/serendipity-midnight.json")
				)
			)
		),
		light: JSON.parse(
			String(
				readFileSync(resolve(__dirname, "./src/lib/styles/themes/serendipity-morning.json"))
			)
		),
	},
	getHighlighter: (options) =>
		getHighlighter({
			...options,
			langs: [
				"plaintext",
				import("shiki/langs/javascript.mjs"),
				import("shiki/langs/typescript.mjs"),
				import("shiki/langs/css.mjs"),
				import("shiki/langs/svelte.mjs"),
				import("shiki/langs/shellscript.mjs"),
				import("shiki/langs/markdown.mjs"),
			],
		}),
	keepBackground: false,
	onVisitLine(node) {
		if (node.children.length === 0) {
			// @ts-expect-error - we're changing the node type
			node.children = { type: "text", value: " " };
		}
	},
	onVisitHighlightedLine(node) {
		node.properties.className = ["line--highlighted"];
	},
	onVisitHighlightedChars(node) {
		node.properties.className = ["chars--highlighted"];
	},
};

export const mdsxConfig = defineConfig({
	extensions: [".md"],
	remarkPlugins: [remarkGfm, remarkRemovePrettierIgnore],
	rehypePlugins: [
		rehypeSlug,
		rehypeComponentExample,
		[rehypePrettyCode, prettyCodeOptions],
		rehypeHandleMetadata,
	],
	blueprints: {
		default: {
			path: resolve(__dirname, "./src/lib/components/markdown/blueprint.svelte"),
		},
	},
});

/**
 * Removes `<!-- prettier-ignore -->` and `// prettier-ignore` from code blocks
 * before they are converted to HTML for syntax highlighting.
 *
 * We do this because sometimes we want to force a line break in code blocks, but
 * prettier removes them, however, we don't want to include the ignore statement
 * in the final code block.
 *
 * One caveat is that if you did want to include the ignore statement in the final
 * code block, you'd have to do some hacky stuff like including it in the comment
 * itself and checking for it in the code block, but that's not something we need
 * at the moment.
 *
 * @returns {MdastTransformer} - unified transformer
 *
 */
function remarkRemovePrettierIgnore() {
	return async (tree) => {
		visit(tree, "code", (node) => {
			node.value = node.value
				.replaceAll("<!-- prettier-ignore -->\n", "")
				.replaceAll("// prettier-ignore\n", "");
		});
	};
}

/**
 * Adds `data-metadata` to `<figure>` elements that contain a `<figcaption>`.
 * We use this to style elements within the `<figure>` differently if a `<figcaption>`
 * is present.
 *
 * @returns {HastTransformer} - unified transformer
 */
function rehypeHandleMetadata() {
	return async (tree) => {
		visit(tree, (node) => {
			if (node?.type === "element" && node?.tagName === "figure") {
				if (!("data-rehype-pretty-code-figure" in node.properties)) {
					return;
				}

				const preElement = node.children.at(-1);
				if (preElement && "tagName" in preElement && preElement.tagName !== "pre") {
					return;
				}

				const firstChild = node.children.at(0);

				if (firstChild && "tagName" in firstChild && firstChild.tagName === "figcaption") {
					node.properties["data-metadata"] = "";
					const lastChild = node.children.at(-1);
					if (lastChild && "properties" in lastChild) {
						lastChild.properties["data-metadata"] = "";
					}
				}
			}
		});
	};
}

/**
 * Adds the source code to component examples.
 *
 * @returns {HastTransformer} - unified transformer
 */
export function rehypeComponentExample() {
	return async (tree) => {
		const nameRegex = /name="([^"]+)"/;
		const compRegex = /comp="([^"]+)"/;
		visit(tree, (node, index, parent) => {
			if (node?.type === "raw" && node?.value?.startsWith("<ComponentPreview")) {
				const currNode = node;
				const nameMatch = currNode.value.match(nameRegex);
				const name = nameMatch ? nameMatch[1] : null;
				const compMatch = currNode.value.match(compRegex);
				const comp = compMatch ? compMatch[1] : null;

				if (!name || !comp) return null;

				try {
					const sourceCode = getComponentSourceFileContent(name);
					if (!sourceCode)
						throw new Error(`Could not find source code for component: ${name}`);

					const sourceCodeNode = u("element", {
						tagName: "pre",
						properties: {
							className: ["code"],
						},
						children: [
							u("element", {
								tagName: "code",
								properties: {
									className: [`language-svelte`],
								},
								attributes: {},
								children: [
									{
										type: "text",
										value: sourceCode,
									},
								],
							}),
						],
					});
					if (!index) return;
					// @ts-expect-error - we're using an untyped node here
					parent.children.splice(index + 1, 0, sourceCodeNode);
				} catch (e) {
					console.error(e);
				}
			}
		});
	};
}

function getComponentSourceFileContent(src = "") {
	if (!src) return null;

	// Read the source file.
	const filePath = path.join(process.cwd(), `./src/lib/components/demos/${src}.svelte`);

	return prettier.format(readFileSync(filePath, "utf-8"), codeBlockPrettierConfig);
}
