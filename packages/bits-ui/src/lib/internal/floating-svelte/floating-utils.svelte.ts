import type { Getter, MaybeGetter } from "svelte-toolbelt";

export function get<T>(valueOrGetValue: MaybeGetter<T>): T {
	return typeof valueOrGetValue === "function"
		? (valueOrGetValue as Getter<T>)()
		: valueOrGetValue;
}

export function getDPR(element: Element): number {
	if (typeof window === "undefined") return 1;
	const win = element.ownerDocument.defaultView || window;
	return win.devicePixelRatio || 1;
}

export function roundByDPR(element: Element, value: number) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}

export function getFloatingContentCSSVars(name: string) {
	return {
		[`--bits-${name}-content-transform-origin`]: `var(--bits-floating-transform-origin)`,
		[`--bits-${name}-content-available-width`]: `var(--bits-floating-available-width)`,
		[`--bits-${name}-content-available-height`]: `var(--bits-floating-available-height)`,
		[`--bits-${name}-anchor-width`]: `var(--bits-floating-anchor-width)`,
		[`--bits-${name}-anchor-height`]: `var(--bits-floating-anchor-height)`,
	};
}
