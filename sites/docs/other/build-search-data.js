// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import removeMd from "remove-markdown";
import { componentDocs, docs, typeHelperDocs, utilityDocs } from "../.velite/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function cleanMd(md) {
	return removeMd(md, {
		replaceLinksWithURL: true,
		gfm: true,
		useImgAltText: true,
	})
		.replaceAll("\n", " ")
		.replaceAll("\t", " ");
}

export function buildDocsIndex() {
	const components = componentDocs.map((doc) => ({
		title: doc.title,
		content: cleanMd(doc.raw),
		description: doc.description,
		href: `/docs/components/${doc.slug}`,
	}));

	const utilities = utilityDocs.map((doc) => ({
		title: doc.title,
		content: cleanMd(doc.raw),
		description: doc.description,
		href: `/docs/utilities/${doc.slug}`,
	}));

	const typeHelpers = typeHelperDocs.map((doc) => ({
		title: doc.title,
		content: cleanMd(doc.raw),
		description: doc.description,
		href: `/docs/type-helpers/${doc.slug}`,
	}));

	const mainPages = docs.map((doc) => ({
		title: doc.title,
		content: cleanMd(doc.raw),
		description: doc.description,
		href: `/docs${doc.slugFull}`,
	}));

	return [...components, ...utilities, ...typeHelpers, ...mainPages];
}

const searchData = buildDocsIndex();

writeFileSync(
	resolve(__dirname, "../src/routes/api/search.json/search.json"),
	JSON.stringify(searchData),
	{ flag: "w" }
);
