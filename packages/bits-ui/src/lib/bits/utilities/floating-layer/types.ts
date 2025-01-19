import type { Snippet } from "svelte";
import type { ReadableBox } from "svelte-toolbelt";
import type { Align, Boundary, Side } from "./use-floating-layer.svelte.js";
import type { Arrayable } from "$lib/internal/types.js";
import type { Direction, StyleProperties } from "$lib/shared/index.js";
import type { Measurable } from "$lib/internal/floating-svelte/types.js";

export type FloatingLayerContentProps = {
	/**
	 * The preferred side of the anchor to render against when open.
	 * Will be reversed when collisions occur.
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	side?: Side;

	/**
	 * The distance in pixels from the anchor to the floating element.
	 * @see https://floating-ui.com/docs/offset#options
	 */
	sideOffset?: number;

	/**
	 * The preferred alignment of the anchor to render against when open.
	 * This may change when collisions occur.
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	align?: Align;

	/**
	 * An offset in pixels from the "start" or "end" alignment options.
	 * @see https://floating-ui.com/docs/offset#options
	 */
	alignOffset?: number | undefined;

	/**
	 * This describes the padding between the arrow and the edges of the floating element.
	 * If your floating element has border-radius, this will prevent it from overflowing
	 * the corners.
	 */
	arrowPadding?: number;

	/**
	 * When `true`, overrides the `side` and `align` options to prevent collisions
	 * with the boundary edges.
	 *
	 * @default true
	 * @see https://floating-ui.com/docs/flip
	 */
	avoidCollisions?: boolean | undefined;

	/**
	 * A boundary element or array of elements to check for collisions against.
	 *
	 * @see https://floating-ui.com/docs/detectoverflow#boundary
	 */
	collisionBoundary?: Arrayable<Boundary>;

	/**
	 * The amount in pixels of virtual padding around the viewport edges to check
	 * for overflow which will cause a collision.
	 *
	 * @default 8
	 * @see https://floating-ui.com/docs/detectOverflow#padding
	 */
	collisionPadding?: number | Partial<Record<Side, number>>;

	sticky?: "partial" | "always";

	hideWhenDetached?: boolean;

	/**
	 * "optimized" will only update the position when necessary, while "always"
	 * will update the position on each animation frame, which is useful if the floating
	 * content is following something like a mouse cursor.
	 *
	 * @defaultValue "optimized"
	 */
	updatePositionStrategy?: "optimized" | "always";

	content?: Snippet<[{ props: Record<string, unknown>; wrapperProps: Record<string, unknown> }]>;

	/**
	 * The positioning strategy to use for the floating element.
	 * @see https://floating-ui.com/docs/computeposition#strategy
	 */
	strategy?: "absolute" | "fixed" | undefined;

	/**
	 * The text direction of the content.
	 */
	dir?: Direction;

	/**
	 * Whether to prevent scrolling the body when the content is open.
	 */
	preventScroll?: boolean;

	/**
	 * Use an element other than the trigger to anchor the content to. If provided,
	 * the content will be anchored to the provided element instead of the trigger.
	 *
	 * You can pass a selector string or an HTMLElement.
	 */
	customAnchor?: string | HTMLElement | Measurable | null;
};

export type FloatingLayerContentImplProps = {
	id: string;

	/**
	 * The ID of the content wrapper element.
	 */
	wrapperId?: string;

	/**
	 * The style properties to apply to the content.
	 */
	style?: StyleProperties | string | null;

	/**
	 * Callback that is called when the floating element is placed.
	 */
	onPlaced?: () => void;
} & FloatingLayerContentProps;

export type FloatingLayerAnchorProps = {
	id: string;
	children?: Snippet;
	virtualEl?: ReadableBox<Measurable | null>;
};
