import type { AnyFn } from "./types.js";

export function createSharedHook<T extends AnyFn>(factory: T): T {
	let subscribers = 0;
	let state: ReturnType<T> | undefined = $state();
	let scope: (() => void) | undefined;

	function dispose() {
		subscribers -= 1;
		if (scope && subscribers <= 0) {
			scope();
			state = undefined;
			scope = undefined;
		}
	}

	return <T>((...args) => {
		subscribers += 1;
		if (state === undefined) {
			scope = $effect.root(() => {
				state = factory(...args);
			});
		}

		$effect(() => {
			return () => {
				dispose();
			};
		});

		return state;
	});
}
