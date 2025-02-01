import type { Snippet } from "svelte";
import type { FocusScopeContainerProps } from "./use-focus-scope.svelte.js";
import type { EventCallback } from "$lib/internal/events.js";

export type FocusScopeProps = {
	/**
	 * Event handler called when auto-focusing on open.
	 * Can be prevented.
	 */
	onOpenAutoFocus?: EventCallback;

	/**
	 * Event handler called when auto-focusing on close.
	 * Can be prevented.
	 */
	onCloseAutoFocus?: EventCallback;

	/**
	 * Whether focus is trapped within the focus scope.
	 *
	 * @defaultValue false
	 */
	trapFocus?: boolean;
};

export type FocusScopeImplProps = {
	/**
	 * The ID of the focus scope container node.
	 */
	id: string;

	/**
	 * The snippet to render the focus scope container with its props.
	 */
	focusScope?: Snippet<[{ props: FocusScopeContainerProps }]>;

	/**
	 * When `true` will loop through the tabbable elements in the focus scope.
	 */
	loop?: boolean;

	/**
	 * Whether the content within the focus trap is being force mounted or not.
	 */
	forceMount?: boolean;
} & FocusScopeProps;
