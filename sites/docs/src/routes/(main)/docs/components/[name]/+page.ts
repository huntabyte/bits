import { getComponentDoc } from "$lib/utils/docs.js";

export async function load(event) {
	const { component, title, metadata, schemas } = await getComponentDoc(event.params.name);
	return {
		component,
		title,
		metadata,
		schemas,
	};
}
