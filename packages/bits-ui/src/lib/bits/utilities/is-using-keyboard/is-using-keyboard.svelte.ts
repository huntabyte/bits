import { type AnyFn, executeCallbacks } from "svelte-toolbelt";
import { on } from "svelte/events";

// Using global state to avoid multiple listeners.
let isUsingKeyboard = $state(false);

/**
 * Detects whether the user is currently using the keyboard
 * or not by listening to keyboard and pointer events. Uses shared global
 * state to avoid listener duplication.
 */
export class IsUsingKeyboard {
	static _refs = 0; // Reference counting to avoid multiple listeners.
	static _cleanup?: AnyFn;

	constructor() {
		$effect(() => {
			if (IsUsingKeyboard._refs === 0) {
				IsUsingKeyboard._cleanup = $effect.root(() => {
					const callbacksToDispose: AnyFn[] = [];

					const handlePointer = (_: PointerEvent) => {
						isUsingKeyboard = false;
					};

					const handleKeydown = (_: KeyboardEvent) => {
						isUsingKeyboard = true;
					};

					callbacksToDispose.push(
						on(document, "pointerdown", handlePointer, {
							capture: true,
						}),
						on(document, "pointermove", handlePointer, {
							capture: true,
						}),
						on(document, "keydown", handleKeydown, {
							capture: true,
						})
					);

					// Don't forget to spread and call twice.
					return executeCallbacks(...callbacksToDispose);
				});
			}

			IsUsingKeyboard._refs++;

			return () => {
				IsUsingKeyboard._refs--;

				if (IsUsingKeyboard._refs === 0) {
					isUsingKeyboard = false;
					IsUsingKeyboard._cleanup?.();
				}
			};
		});
	}

	get current() {
		return isUsingKeyboard;
	}

	set current(value: boolean) {
		isUsingKeyboard = value;
	}
}
