import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	Without,
} from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";

export type CollapsibleRootPropsWithoutHTML = WithChild<{
	/**
	 * Whether the collapsible is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Whether the collapsible is open.
	 *
	 * @defaultValue false
	 */
	open?: boolean;

	/**
	 * A callback function called when the open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;
}>;

export type CollapsibleRootProps = CollapsibleRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CollapsibleRootPropsWithoutHTML>;

export type CollapsibleContentSnippetProps = {
	open: boolean;
};

export type CollapsibleContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	{
		/**
		 * Whether to force mount the content to the DOM.
		 *
		 * @defaultValue false
		 */
		forceMount?: boolean;
	},
	CollapsibleContentSnippetProps
>;

export type CollapsibleContentProps = CollapsibleContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CollapsibleContentPropsWithoutHTML>;

export type CollapsibleTriggerPropsWithoutHTML = WithChild;

export type CollapsibleTriggerProps = CollapsibleTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, CollapsibleTriggerPropsWithoutHTML>;
