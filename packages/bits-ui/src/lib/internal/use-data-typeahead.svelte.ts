import { getNextMatch } from "./arrays.js";
import { boxAutoReset } from "./box-auto-reset.svelte.js";

export type DataTypeahead = ReturnType<typeof useDataTypeahead>;

type UseDataTypeaheadOpts = {
	onMatch: (value: string) => void;
	getCurrentItem: () => string;
	enabled: boolean;
};

export function useDataTypeahead(opts: UseDataTypeaheadOpts) {
	// Reset `search` 1 second after it was last updated
	const search = boxAutoReset("", 1000);

	function handleTypeaheadSearch(key: string, candidateValues: string[]) {
		if (!opts.enabled) return;
		if (!candidateValues.length) return;

		search.current = search.current + key;
		const currentItem = opts.getCurrentItem();
		const currentMatch = candidateValues.find((item) => item === currentItem) ?? "";
		const values = candidateValues.map((item) => item ?? "");
		const nextMatch = getNextMatch(values, search.current, currentMatch);
		const newItem = candidateValues.find((item) => item === nextMatch);
		if (newItem) {
			opts.onMatch(newItem);
		}
		return newItem;
	}

	function resetTypeahead() {
		search.current = "";
	}

	return {
		search,
		handleTypeaheadSearch,
		resetTypeahead,
	};
}
