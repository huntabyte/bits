import { flushSync } from "svelte";
import type { Getter } from "svelte-toolbelt";

/**
 * Calls a function the next frame after all animations have finished.
 */
export function useAfterAnimations(getNode: Getter<HTMLElement | null>) {
	let frame = -1;

	function cancelFrame() {
		cancelAnimationFrame(frame);
	}

	$effect(() => cancelFrame);

	return (fn: () => void) => {
		cancelFrame();
		const node = getNode();
		if (!node) return;
		if (typeof node.getAnimations !== "function" || globalThis.bitsAnimationsDisabled) {
			fn();
		} else {
			frame = requestAnimationFrame(() => {
				Promise.allSettled(node.getAnimations().map((anim) => anim.finished)).then(() => {
					flushSync(fn);
				});
			});
		}
	};
}
