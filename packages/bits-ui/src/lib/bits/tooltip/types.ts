import type { FloatingLayerContentProps } from "../utilities/floating-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { DismissibleLayerProps } from "../utilities/dismissible-layer/types.js";
import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";
import type { PortalProps } from "$lib/bits/utilities/portal/types.js";
import type { FloatingContentSnippetProps, StaticContentSnippetProps } from "$lib/shared/types.js";

export type TooltipProviderPropsWithoutHTML = WithChildren<{
	/**
	 * The delay in milliseconds before the tooltip opens.
	 *
	 * @defaultValue 700
	 */
	delayDuration?: number;

	/**
	 * How much time a user has to enter another trigger without
	 * incurring a delay again.
	 * @defaultValue 300
	 */
	skipDelayDuration?: number;

	/**
	 * Prevents tooltip from remaining open when hovering over the content.
	 *
	 * @defaultValue false
	 */
	disableHoverableContent?: boolean;

	/**
	 * When `true`, the tooltip will not close when you click on the trigger.
	 *
	 * @defaultValue false
	 */
	disableCloseOnTriggerClick?: boolean;

	/**
	 * When `true`, the tooltip will be disabled and will not open.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Prevent the tooltip from opening if the focus did not come using
	 * the keyboard.
	 *
	 * @defaultValue false
	 */
	ignoreNonKeyboardFocus?: boolean;
}>;

export type TooltipProviderProps = TooltipProviderPropsWithoutHTML;

export type TooltipRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the tooltip.
	 *
	 * @defaultValue false
	 */
	open?: boolean;

	/**
	 * A callback that will be called when the tooltip is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * The delay in milliseconds before the tooltip opens.
	 *
	 * @defaultValue 700
	 */
	delayDuration?: number;

	/**
	 * Prevents tooltip from remaining open when hovering over the content.
	 *
	 * @defaultValue false
	 */
	disableHoverableContent?: boolean;

	/**
	 * When `true`, the tooltip will not close when you click on the trigger.
	 *
	 * @defaultValue false
	 */
	disableCloseOnTriggerClick?: boolean;

	/**
	 * When `true`, the tooltip will be disabled and will not open.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Prevent the tooltip from opening if the focus did not come using
	 * the keyboard.
	 *
	 * @defaultValue false
	 */
	ignoreNonKeyboardFocus?: boolean;
}>;

export type TooltipRootProps = TooltipRootPropsWithoutHTML;

export type TooltipContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
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
		| "updatePositionStrategy"
		| "dir"
	> &
		Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
		EscapeLayerProps & {
			/**
			 * When `true`, the tooltip will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		},
	FloatingContentSnippetProps
>;

export type TooltipContentProps = TooltipContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TooltipContentPropsWithoutHTML>;

export type TooltipContentStaticPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Pick<FloatingLayerContentProps, "dir"> &
		Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
		EscapeLayerProps & {
			/**
			 * When `true`, the tooltip will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		},
	StaticContentSnippetProps
>;

export type TooltipContentStaticProps = TooltipContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TooltipContentStaticPropsWithoutHTML>;

export type TooltipArrowPropsWithoutHTML = ArrowPropsWithoutHTML;
export type TooltipArrowProps = ArrowProps;

export type TooltipPortalPropsWithoutHTML = PortalProps;
export type TooltipPortalProps = PortalProps;

export type TooltipTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the tooltip trigger is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type TooltipTriggerProps = TooltipTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, TooltipTriggerPropsWithoutHTML>;
