import { isBrowser, isElementHidden, isSelectableInput } from "./is.js";

export type FocusableTarget = HTMLElement | { focus: () => void };

/**
 * Handles `initialFocus` prop behavior for the
 * Calendar & RangeCalendar components.
 */
export function handleCalendarInitialFocus(calendar: HTMLElement) {
	if (!isBrowser) return;
	const selectedDay = calendar.querySelector<HTMLElement>("[data-selected]");
	if (selectedDay) return focusWithoutScroll(selectedDay);

	const today = calendar.querySelector<HTMLElement>("[data-today]");
	if (today) return focusWithoutScroll(today);

	const firstDay = calendar.querySelector<HTMLElement>("[data-calendar-date]");
	if (firstDay) return focusWithoutScroll(firstDay);
}

/**
 * A utility function that focuses an element without scrolling.
 */
export function focusWithoutScroll(element: HTMLElement) {
	const scrollPosition = {
		x: window.pageXOffset || document.documentElement.scrollLeft,
		y: window.pageYOffset || document.documentElement.scrollTop,
	};
	element.focus();
	window.scrollTo(scrollPosition.x, scrollPosition.y);
}

/**
 * A utility function that focuses an element.
 */
export function focus(element?: FocusableTarget | null, { select = false } = {}) {
	if (!(element && element.focus)) return;
	const previouslyFocusedElement = document.activeElement;
	// prevent scroll on focus
	element.focus({ preventScroll: true });
	// only elect if its not the same element, it supports selection, and we need to select it
	if (element !== previouslyFocusedElement && isSelectableInput(element) && select) {
		element.select();
	}
}

/**
 * Attempts to focus the first element in a list of candidates.
 * Stops when focus is successful.
 */
export function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
	const previouslyFocusedElement = document.activeElement;
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (document.activeElement !== previouslyFocusedElement) {
			return true;
		}
	}
}

/**
 * Returns the first visible element in a list.
 * NOTE: Only checks visibility up to the `container`.
 */
export function findVisible(elements: HTMLElement[], container: HTMLElement) {
	for (const element of elements) {
		// we stop checking if it's hidden at the `container` level (excluding)
		if (!isElementHidden(element, container)) return element;
	}
}

/**
 * Returns a list of potential tabbable candidates.
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
export function getTabbableCandidates(container: HTMLElement) {
	const nodes: HTMLElement[] = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acceptNode: (node: any) => {
			const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
			if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
			// `.tabIndex` is not the same as the `tabindex` attribute. It works on the
			// runtime's understanding of tabbability, so this automatically accounts
			// for any kind of element that could be tabbed to.
			return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		},
	});
	while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);
	// we do not take into account the order of nodes with positive `tabIndex` as it
	// hinders accessibility to have tab order different from visual order.
	return nodes;
}

/**
 * A utility function that returns the first and last elements within a container that are
 * visible and focusable.
 */
export function getTabbableEdges(container: HTMLElement) {
	const candidates = getTabbableCandidates(container);
	const first = findVisible(candidates, container);
	const last = findVisible(candidates.reverse(), container);
	return [first, last] as const;
}
