import { SvelteMap } from "svelte/reactivity";
import { type Getter, afterSleep, afterTick, box } from "svelte-toolbelt";
import { untrack } from "svelte";
import type { Fn } from "./types.js";
import { isBrowser, isIOS } from "./is.js";
import { addEventListener } from "./events.js";
import { useId } from "./use-id.js";
import { createSharedHook } from "./create-shared-hook.svelte.js";

export type ScrollBodyOption = {
	padding?: boolean | number;
	margin?: boolean | number;
};

const useBodyLockStackCount = createSharedHook(() => {
	const map = new SvelteMap<string, boolean>();

	const locked = $derived.by(() => {
		for (const value of map.values()) {
			if (value) {
				return true;
			}
		}
		return false;
	});

	let initialBodyStyle: Partial<CSSStyleDeclaration> = $state<Partial<CSSStyleDeclaration>>({});

	let stopTouchMoveListener: Fn | null = null;

	function resetBodyStyle() {
		if (!isBrowser) return;
		document.body.style.paddingRight = initialBodyStyle.paddingRight ?? "";
		document.body.style.marginRight = initialBodyStyle.marginRight ?? "";
		document.body.style.pointerEvents = initialBodyStyle.pointerEvents ?? "";
		document.body.style.removeProperty("--scrollbar-width");
		document.body.style.overflow = initialBodyStyle.overflow ?? "";
		isIOS && stopTouchMoveListener?.();
	}

	$effect(() => {
		const curr = locked;
		return untrack(() => {
			if (!curr) {
				return;
			}

			const bodyStyle = getComputedStyle(document.body);
			initialBodyStyle.overflow = bodyStyle.overflow;
			initialBodyStyle.paddingRight = bodyStyle.paddingRight;
			initialBodyStyle.marginRight = bodyStyle.marginRight;
			initialBodyStyle.pointerEvents = bodyStyle.pointerEvents;

			// TODO: account for RTL direction, etc.
			const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			const paddingRight = Number.parseInt(initialBodyStyle.paddingRight ?? "0", 10);

			const config = {
				padding: paddingRight + verticalScrollbarWidth,
				margin: Number.parseInt(initialBodyStyle.marginRight ?? "0", 10),
			};

			if (verticalScrollbarWidth > 0) {
				document.body.style.paddingRight = `${config.padding}px`;
				document.body.style.marginRight = `${config.margin}px`;
				document.body.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
				document.body.style.overflow = "hidden";
			}

			if (isIOS) {
				stopTouchMoveListener = addEventListener(
					document,
					"touchmove",
					(e) => {
						if (e.target !== document.documentElement) return;

						if (e.touches.length > 1) return;
						e.preventDefault();
					},
					{ passive: false }
				);
			}

			afterTick(() => {
				document.body.style.pointerEvents = "none";
				document.body.style.overflow = "hidden";
			});
		});
	});

	$effect(() => {
		return () => {
			stopTouchMoveListener?.();
		};
	});

	return {
		get map() {
			return map;
		},
		resetBodyStyle,
	};
});

export function useBodyScrollLock(
	initialState?: boolean | undefined,
	restoreScrollDelay: Getter<number | null> = () => null
) {
	const id = useId();
	const countState = useBodyLockStackCount();
	const _restoreScrollDelay = $derived(restoreScrollDelay());

	countState.map.set(id, initialState ?? false);

	const locked = box.with(
		() => countState.map.get(id) ?? false,
		(v) => countState.map.set(id, v)
	);

	$effect(() => {
		return () => {
			countState.map.delete(id);
			// if any locks are still active, we don't reset the body style
			if (isAnyLocked(countState.map)) return;

			// if no locks are active (meaning this was the last lock), we reset the body style
			if (_restoreScrollDelay === null) {
				requestAnimationFrame(() => countState.resetBodyStyle());
			} else {
				afterSleep(_restoreScrollDelay, () => countState.resetBodyStyle());
			}
		};
	});

	return locked;
}

function isAnyLocked(map: Map<string, boolean>) {
	for (const [_, value] of map) {
		if (value) return true;
	}
	return false;
}
