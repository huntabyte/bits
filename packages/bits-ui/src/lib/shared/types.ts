export type FloatingContentSnippetProps = {
	/**
	 * Whether the content is open or closed. Used alongside the `forceMount` prop to
	 * conditionally render the content using Svelte transitions.
	 */
	open: boolean;

	/**
	 * Attributes to spread onto a wrapper element around the content.
	 * Do not style the wrapper element, its styles are computed by Floating UI.
	 */
	wrapperProps: Record<string, unknown>;
};

export type StaticContentSnippetProps = Omit<FloatingContentSnippetProps, "wrapperProps">;
