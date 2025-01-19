import type { Snippet } from "svelte";

export type PortalProps = {
	/**
	 * Where to portal the content to.
	 *
	 * @defaultValue document.body
	 */
	to?: HTMLElement | string | DocumentFragment;

	/**
	 * Disable portalling and render the component inline
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * The children content to render within the portal.
	 */
	children?: Snippet;
};
