import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes.js";
import type { Direction, Orientation, WithChild, Without } from "$lib/shared/index.js";

export type ScrollAreaType = "hover" | "scroll" | "auto" | "always";

export type ScrollAreaRootPropsWithoutHTML = WithChild<{
	/**
	 * The type of scroll area to render.
	 *
	 * @defaultValue "hover"
	 */
	type?: ScrollAreaType;

	/**
	 * The reading direction of the application.
	 */
	dir?: Direction;

	/**
	 * The amount of time in milliseconds to delay before hiding the scrollbars
	 * after leaving the scroll area or stopping scrolling.
	 *
	 * @defaultValue 600
	 */
	scrollHideDelay?: number;
}>;

export type ScrollAreaRootProps = ScrollAreaRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ScrollAreaRootPropsWithoutHTML>;

export type ScrollAreaViewportPropsWithoutHTML = Omit<WithChild, "child">;

export type ScrollAreaViewportProps = ScrollAreaViewportPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ScrollAreaViewportPropsWithoutHTML>;

export type ScrollAreaScrollbarPropsWithoutHTML = WithChild<{
	orientation: Orientation;

	/**
	 * Whether to forcefully mount the component. Useful when working with
	 * external animation/transition libraries.
	 */
	forceMount?: boolean;
}>;

export type ScrollAreaScrollbarProps = ScrollAreaScrollbarPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ScrollAreaScrollbarPropsWithoutHTML>;

export type ScrollAreaThumbPropsWithoutHTML = WithChild<{
	/**
	 * Whether to forcefully mount the component. Useful when working with
	 * external animation/transition libraries.
	 */
	forceMount?: boolean;
}>;

export type ScrollAreaThumbProps = ScrollAreaThumbPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ScrollAreaThumbPropsWithoutHTML>;

export type ScrollAreaCornerPropsWithoutHTML = WithChild;

export type ScrollAreaCornerProps = ScrollAreaCornerPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ScrollAreaCornerPropsWithoutHTML>;

export type _ScrollbarStubProps = Omit<ScrollAreaScrollbarProps, "orientation" | "ref" | "id"> & {
	id: string;
};
