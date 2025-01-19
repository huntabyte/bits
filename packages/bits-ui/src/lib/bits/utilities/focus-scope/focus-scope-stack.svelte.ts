import { box } from "svelte-toolbelt";
import { useId } from "$lib/internal/use-id.js";

export type FocusScopeAPI = {
	id: string;
	paused: boolean;
	pause: () => void;
	resume: () => void;
};

const focusStack = box<FocusScopeAPI[]>([]);

export function createFocusScopeStack() {
	const stack = focusStack;

	return {
		add(focusScope: FocusScopeAPI) {
			// pause the currently active focus scope (top of the stack)
			const activeFocusScope = stack.current[0];
			if (focusScope.id !== activeFocusScope?.id) {
				activeFocusScope?.pause();
			}

			// remove in case it already exists because it'll be added to the top
			stack.current = removeFromFocusScopeArray(stack.current, focusScope);
			stack.current.unshift(focusScope);
		},
		remove(focusScope: FocusScopeAPI) {
			stack.current = removeFromFocusScopeArray(stack.current, focusScope);
			stack.current[0]?.resume();
		},
	};
}

export function createFocusScopeAPI(): FocusScopeAPI {
	let paused = $state(false);

	return {
		id: useId(),
		get paused() {
			return paused;
		},
		pause() {
			paused = true;
		},
		resume() {
			paused = false;
		},
	};
}

function removeFromFocusScopeArray(arr: FocusScopeAPI[], item: FocusScopeAPI) {
	return [...arr].filter((i) => i.id !== item.id);
}

export function removeLinks(items: HTMLElement[]) {
	return items.filter((item) => item.tagName !== "A");
}
