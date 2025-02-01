import type { Snippet } from "svelte";

export type PointerHandler = (e: PointerEvent) => void;

export type TextSelectionLayerProps = {
	/**
	 * Passing `true` will prevent the overflow of text selection
	 * outside the element, provided the element is the top layer.
	 * @defaultValue `true`
	 */
	preventOverflowTextSelection?: boolean;
};

export type TextSelectionLayerImplProps = {
	/**
	 * Whether the layer is enabled. Currently, we determine this with the
	 * `presence` returned from the `presence` layer.
	 */
	enabled: boolean;

	/**
	 * DOM ID of the node.
	 */
	id: string;

	children?: Snippet;

	/**
	 * Callback fired when pointerdown event triggers. Call `preventDefault()`
	 * to disable the prevention of text-selection overflow.
	 */
	onPointerDown?: PointerHandler;

	/**
	 * Callback fired when pointerup event triggers.
	 */
	onPointerUp?: PointerHandler;
} & TextSelectionLayerProps;
