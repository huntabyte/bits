export function isOrContainsTarget(node: HTMLElement, target: Element) {
	return node === target || node.contains(target);
}

export function getOwnerDocument(el: Element | null | undefined) {
	return el?.ownerDocument ?? document;
}
