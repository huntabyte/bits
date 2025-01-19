import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { DismissibleLayerProps } from "../utilities/dismissible-layer/types.js";
import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type { FloatingLayerContentProps } from "../utilities/floating-layer/types.js";
import type { PortalProps } from "../utilities/portal/types.js";
import type {
	BitsPrimitiveAnchorAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type { FloatingContentSnippetProps, StaticContentSnippetProps } from "$lib/shared/types.js";

export type LinkPreviewRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the link preview.
	 *
	 * @defaultValue false
	 */
	open?: boolean;

	/**
	 * A callback that will be called when the link preview is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * The delay in milliseconds before the preview opens.
	 *
	 * @defaultValue 700
	 */
	openDelay?: number;

	/**
	 * The delay in milliseconds before the preview closes.
	 *
	 * @defaultValue 300
	 */
	closeDelay?: number;

	/**
	 * When `true`, the preview will be disabled and will not open.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Prevent the preview from opening if the focus did not come using
	 * the keyboard.
	 *
	 * @defaultValue false
	 */
	ignoreNonKeyboardFocus?: boolean;
}>;

export type LinkPreviewRootProps = LinkPreviewRootPropsWithoutHTML;

export type LinkPreviewContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Pick<
		FloatingLayerContentProps,
		| "side"
		| "sideOffset"
		| "align"
		| "alignOffset"
		| "avoidCollisions"
		| "collisionBoundary"
		| "collisionPadding"
		| "arrowPadding"
		| "sticky"
		| "hideWhenDetached"
		| "dir"
	> &
		Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
		EscapeLayerProps & {
			/**
			 * When `true`, the link preview content will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		},
	FloatingContentSnippetProps
>;

export type LinkPreviewContentProps = LinkPreviewContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, LinkPreviewContentPropsWithoutHTML>;

export type LinkPreviewContentStaticPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Pick<FloatingLayerContentProps, "dir"> &
		Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
		EscapeLayerProps & {
			/**
			 * When `true`, the link preview content will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		},
	StaticContentSnippetProps
>;

export type LinkPreviewContentStaticProps = LinkPreviewContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, LinkPreviewContentStaticPropsWithoutHTML>;

export type LinkPreviewArrowPropsWithoutHTML = ArrowPropsWithoutHTML;
export type LinkPreviewArrowProps = ArrowProps;

export type LinkPreviewPortalPropsWithoutHTML = PortalProps;
export type LinkPreviewPortalProps = LinkPreviewPortalPropsWithoutHTML;

export type LinkPreviewTriggerPropsWithoutHTML = WithChild;

export type LinkPreviewTriggerProps = LinkPreviewTriggerPropsWithoutHTML &
	Without<BitsPrimitiveAnchorAttributes, LinkPreviewTriggerPropsWithoutHTML>;
