import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { PopperLayerProps, PopperLayerStaticProps } from "../utilities/popper-layer/types.js";
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
import type { FloatingContentSnippetProps, StaticContentSnippetProps } from "$lib/shared/types.js";

export type PopoverRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the popover.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;
}>;

export type PopoverRootProps = PopoverRootPropsWithoutHTML;

export type PopoverContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<PopperLayerProps, "content" | "loop">,
	FloatingContentSnippetProps
>;

export type PopoverContentProps = PopoverContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, PopoverContentPropsWithoutHTML>;

export type PopoverContentStaticPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<PopperLayerStaticProps, "content" | "loop">,
	StaticContentSnippetProps
>;

export type PopoverContentStaticProps = PopoverContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, PopoverContentStaticPropsWithoutHTML>;

export type PopoverTriggerPropsWithoutHTML = WithChild;

export type PopoverTriggerProps = PopoverTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, PopoverTriggerPropsWithoutHTML>;

export type PopoverClosePropsWithoutHTML = WithChild;

export type PopoverCloseProps = PopoverClosePropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, PopoverClosePropsWithoutHTML>;

export type PopoverArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type PopoverArrowProps = ArrowProps;
