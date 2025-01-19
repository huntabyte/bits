export function findNextSibling(el: Element, selector: string) {
	let sibling = el.nextElementSibling;

	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.nextElementSibling;
	}
}

export function findPreviousSibling(el: Element, selector: string) {
	let sibling = el.previousElementSibling;

	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.previousElementSibling;
	}
}

export function findFirstStartMarkerWithImmediateSiblingAsEnd(el: Element, type: "item" | "group") {
	const startMarkers = el.querySelectorAll<HTMLElement>(`[data-bits-command-${type}-start]`);

	for (const startMarker of startMarkers) {
		const endMarker = startMarker.nextElementSibling;
		if (endMarker && endMarker.hasAttribute(`data-bits-command-${type}-end`)) {
			return startMarker;
		}
	}

	return null;
}
