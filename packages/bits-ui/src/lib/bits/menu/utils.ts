import { kbd } from "$lib/internal/kbd.js";
import type { Direction } from "$lib/shared/index.js";

export type CheckedState = boolean | "indeterminate";

export const ITEM_NAME = "MenuItem";

export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];
export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SUB_OPEN_KEYS: Record<Direction, string[]> = {
	ltr: [...SELECTION_KEYS, kbd.ARROW_RIGHT],
	rtl: [...SELECTION_KEYS, kbd.ARROW_LEFT],
};
export const SUB_CLOSE_KEYS: Record<Direction, string[]> = {
	ltr: [kbd.ARROW_LEFT],
	rtl: [kbd.ARROW_RIGHT],
};

export function isIndeterminate(checked?: CheckedState): checked is "indeterminate" {
	return checked === "indeterminate";
}

export function getCheckedState(checked: CheckedState) {
	return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}

export interface Point {
	x: number;
	y: number;
}
export type Polygon = Point[];
export type Side = "left" | "right";
export interface GraceIntent {
	area: Polygon;
	side: Side;
}

export function isMouseEvent(event: PointerEvent) {
	return event.pointerType === "mouse";
}
