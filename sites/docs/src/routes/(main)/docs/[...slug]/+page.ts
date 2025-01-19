import { getDoc } from "$lib/utils/docs.js";

export async function load(event) {
	const { component, title, metadata } = await getDoc(event.params.slug);
	return {
		component,
		title,
		metadata,
	};
}
