import removeMd from "remove-markdown";
import { componentDocs, docs, typeHelperDocs, utilityDocs } from "$content/index.js";

export function buildDocsIndex() {
	const components = componentDocs.map((doc) => {
		const content = removeMd(doc.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		});

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs/components/${doc.slug}`,
		};
	});

	const utilities = utilityDocs.map((doc) => {
		const content = removeMd(doc.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		});

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs/utilities/${doc.slug}`,
		};
	});

	const typeHelpers = typeHelperDocs.map((doc) => {
		const content = removeMd(doc.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		});

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs/type-helpers/${doc.slug}`,
		};
	});

	const mainPages = docs.map((doc) => {
		const content = removeMd(doc.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		});

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs/${doc.slug}`,
		};
	});

	return [...components, ...utilities, ...typeHelpers, ...mainPages];
}
