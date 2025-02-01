import type { Getter } from "svelte-toolbelt";
import { isBrowser } from "./is.js";

export function useFormControl(getNode: Getter<HTMLElement | null>) {
	const isInForm = $derived.by(() => {
		if (!isBrowser) return false;
		const node = getNode();
		if (!node) return false;
		return Boolean(node.closest("form"));
	});

	return {
		get current() {
			return isInForm;
		},
	};
}
