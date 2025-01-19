import type { FocusableTarget } from "./focus.js";

export const isBrowser = typeof document !== "undefined";

export const isIOS = getIsIOS();

function getIsIOS() {
	return (
		isBrowser &&
		window?.navigator?.userAgent &&
		(/iP(ad|hone|od)/.test(window.navigator.userAgent) ||
			// The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
			(window?.navigator?.maxTouchPoints > 2 &&
				/iPad|Macintosh/.test(window?.navigator.userAgent)))
	);
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isElement(element: unknown): element is Element {
	return element instanceof Element;
}

export function isElementOrSVGElement(element: unknown): element is Element | SVGElement {
	return element instanceof Element || element instanceof SVGElement;
}

export function isNumberString(value: string) {
	return !Number.isNaN(Number(value)) && !Number.isNaN(Number.parseFloat(value));
}

export function isNull(value: unknown): value is null {
	return value === null;
}

export function isTouch(e: PointerEvent) {
	return e.pointerType === "touch";
}

export function isFocusVisible(element: Element) {
	return element.matches(":focus-visible");
}

export function isNotNull<T>(value: T | null): value is T {
	return value !== null;
}

/**
 * Determines if the provided object is a valid `HTMLInputElement` with
 * a `select` method available.
 */
export function isSelectableInput(
	element: unknown
): element is FocusableTarget & { select: () => void } {
	return element instanceof HTMLInputElement && "select" in element;
}

/**
 * Given a node, determine if it is hidden by walking up the
 * DOM tree until we hit the `stopAt` node (exclusive), if provided)
 * otherwise we stop at the document root.
 */
export function isElementHidden(node: HTMLElement, stopAt?: HTMLElement) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		// we stop at `upTo` (excluding it)
		if (stopAt !== undefined && node === stopAt) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement as HTMLElement;
	}
	return false;
}
