// thanks @joyofcodedev for this :)
import FlexSearch from "flexsearch";

export type SearchContent = {
	title: string;
	content: string;
	description: string;
	href: string;
};

let contentIndex: FlexSearch.Index;
let content: SearchContent[] = [];

export function createContentIndex(data: SearchContent[]) {
	contentIndex = new FlexSearch.Index({
		tokenize: "forward",
	});

	data.forEach((item, i) => {
		contentIndex.add(i, `${item.title} ${item.content} ${item.description}`);
	});

	content = data;
}

export function searchContentIndex(query: string) {
	const match = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const results = contentIndex.search(match);

	return results.map((idx) => content[idx as number]);
}
