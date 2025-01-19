// https://github.com/melt-ui/melt-ui
import type { Direction } from "$lib/shared/index.js";

/**
 * Detects the text direction in the element.
 * @returns {Direction} The text direction ('ltr' for left-to-right or 'rtl' for right-to-left).
 */
export function getElemDirection(elem: HTMLElement): Direction {
	const style = window.getComputedStyle(elem);
	const direction = style.getPropertyValue("direction");

	return direction as Direction;
}
