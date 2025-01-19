export type ScrollLockProps = {
	/**
	 * Whether to prevent body scrolling when the content is open.
	 *
	 * @defaultValue true
	 */
	preventScroll?: boolean;

	/**
	 * The delay in milliseconds before the scrollbar is restored after closing the
	 * dialog. This is only applicable when using the `child` snippet for custom
	 * transitions and `preventScroll` is `true`. You should set this to a value
	 * greater than the transition duration to prevent content from shifting during
	 * the transition.
	 *
	 * @defaultValue null
	 */
	restoreScrollDelay?: number | null;
};
