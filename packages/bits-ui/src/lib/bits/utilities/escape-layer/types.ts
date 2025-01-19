import type { Snippet } from "svelte";

export type EscapeBehaviorType =
	| "close"
	| "defer-otherwise-close"
	| "defer-otherwise-ignore"
	| "ignore";

export type EscapeLayerProps = {
	/**
	 * Callback fired when escape is pressed.
	 */
	onEscapeKeydown?: (e: KeyboardEvent) => void;

	/**
	 * Escape behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to its parent component that has an
	 * escape keydown handler. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to an escape key press.
	 *
	 * @defaultValue `close`
	 */
	escapeKeydownBehavior?: EscapeBehaviorType;
};

// internal props not exposed to the user but used in the implementation
export type EscapeLayerImplProps = {
	/**
	 * Whether the layer is enabled. Currently, we determine this with the
	 * `presence` returned from the `presence` layer.
	 */
	enabled: boolean;
	children?: Snippet;
} & EscapeLayerProps;
