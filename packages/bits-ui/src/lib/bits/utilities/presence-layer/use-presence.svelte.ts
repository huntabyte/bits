import { type ReadableBox, afterTick, executeCallbacks } from "svelte-toolbelt";
import { Previous, watch } from "runed";
import { on } from "svelte/events";
import { useStateMachine } from "$lib/internal/use-state-machine.svelte.js";

export function usePresence(present: ReadableBox<boolean>, id: ReadableBox<string>) {
	let styles = $state({}) as CSSStyleDeclaration;
	let prevAnimationNameState = $state("none");
	const initialState = present.current ? "mounted" : "unmounted";
	let node = $state<HTMLElement | null>(null);
	const prevPresent = new Previous(() => present.current);

	watch([() => id.current, () => present.current], ([id, present]) => {
		if (!id || !present) return;
		afterTick(() => {
			node = document.getElementById(id);
		});
	});

	const { state, dispatch } = useStateMachine(initialState, {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended",
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted",
		},
		unmounted: {
			MOUNT: "mounted",
		},
	});

	watch(
		() => present.current,
		(currPresent) => {
			if (!node) {
				node = document.getElementById(id.current);
			}
			if (!node) return;
			const hasPresentChanged = currPresent !== prevPresent.current;
			if (!hasPresentChanged) return;

			const prevAnimationName = prevAnimationNameState;
			const currAnimationName = getAnimationName(node);

			if (currPresent) {
				dispatch("MOUNT");
			} else if (currAnimationName === "none" || styles.display === "none") {
				// If there is no exit animation or the element is hidden, animations won't run
				// so we unmount instantly
				dispatch("UNMOUNT");
			} else {
				/**
				 * When `present` changes to `false`, we check changes to animation-name to
				 * determine whether an animation has started. We chose this approach (reading
				 * computed styles) because there is no `animationrun` event and `animationstart`
				 * fires after `animation-delay` has expired which would be too late.
				 */
				const isAnimating = prevAnimationName !== currAnimationName;

				if (prevPresent && isAnimating) {
					dispatch("ANIMATION_OUT");
				} else {
					dispatch("UNMOUNT");
				}
			}
		}
	);

	/**
	 * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
	 * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
	 * make sure we only trigger ANIMATION_END for the currently active animation.
	 */

	function handleAnimationEnd(event: AnimationEvent) {
		if (!node) node = document.getElementById(id.current);
		if (!node) return;
		const currAnimationName = getAnimationName(node);
		const isCurrentAnimation =
			currAnimationName.includes(event.animationName) || currAnimationName === "none";

		if (event.target === node && isCurrentAnimation) {
			dispatch("ANIMATION_END");
		}
	}

	function handleAnimationStart(event: AnimationEvent) {
		if (!node) node = document.getElementById(id.current);
		if (!node) return;
		if (event.target === node) {
			prevAnimationNameState = getAnimationName(node);
		}
	}

	watch(
		() => state.current,
		() => {
			if (!node) node = document.getElementById(id.current);
			if (!node) return;
			const currAnimationName = getAnimationName(node);
			prevAnimationNameState = state.current === "mounted" ? currAnimationName : "none";
		}
	);

	watch(
		() => node,
		(node) => {
			if (!node) return;
			styles = getComputedStyle(node);

			return executeCallbacks(
				on(node, "animationstart", handleAnimationStart),
				on(node, "animationcancel", handleAnimationEnd),
				on(node, "animationend", handleAnimationEnd)
			);
		}
	);

	const isPresentDerived = $derived(["mounted", "unmountSuspended"].includes(state.current));

	return {
		get current() {
			return isPresentDerived;
		},
	};
}

function getAnimationName(node?: HTMLElement) {
	return node ? getComputedStyle(node).animationName || "none" : "none";
}
