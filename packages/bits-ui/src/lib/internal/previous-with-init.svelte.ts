import type { Getter } from "svelte-toolbelt";

/**
 * Holds the previous value of a getter, with the initial value being
 * the value of the getter when the instance is created, rather than
 * `undefined`.
 */
export class PreviousWithInit<T> {
	#previous = $state<T>(null!);
	#curr: T;

	constructor(getter: Getter<T>) {
		const init = getter();
		this.#previous = init;
		this.#curr = init;

		$effect(() => {
			this.#previous = this.#curr;
			this.#curr = getter();
		});
	}

	get current(): T {
		return this.#previous;
	}
}
