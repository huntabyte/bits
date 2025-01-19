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
import type { Orientation } from "$lib/shared/index.js";

export type BaseAccordionRootPropsWithoutHTML = {
	/**
	 * Whether the accordion is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Whether to loop through the accordion items when navigating
	 * with the arrow keys.
	 *
	 * @defaultValue true
	 */
	loop?: boolean;

	/**
	 * The orientation of the accordion.
	 *
	 * @defaultValue "vertical"
	 */
	orientation?: Orientation;
};

export type AccordionRootSinglePropsWithoutHTML = BaseAccordionRootPropsWithoutHTML & {
	/**
	 * The type of accordion. If set to `'multiple'`, the accordion will
	 * allow multiple items to be open at the same time. If set to
	 * `'single'`, the accordion will only allow a single item to be open.
	 *
	 * @required
	 */
	type: "single";

	/**
	 * The value of the currently open accordion item.
	 *
	 * @bindable
	 * @defaultValue ""
	 */
	value?: string;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string>;
};

export type AccordionRootMultiplePropsWithoutHTML = BaseAccordionRootPropsWithoutHTML & {
	/**
	 * The type of accordion. If set to `'multiple'`, the accordion will
	 * allow multiple items to be open at the same time. If set to
	 * `'single'`, the accordion will only allow a single item to be open.
	 *
	 * @required
	 */
	type: "multiple";

	/**
	 * The value of the currently open accordion item.
	 *
	 * @bindable
	 * @defaultValue []
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;
};

export type AccordionRootPropsWithoutHTML =
	| WithChild<AccordionRootSinglePropsWithoutHTML>
	| WithChild<AccordionRootMultiplePropsWithoutHTML>;

export type AccordionRootProps = AccordionRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, AccordionRootPropsWithoutHTML>;

export type AccordionTriggerPropsWithoutHTML = WithChild;

export type AccordionTriggerProps = AccordionTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, AccordionTriggerPropsWithoutHTML>;

export type AccordionContentSnippetProps = {
	/**
	 * Whether the accordion content is active/open or not.
	 */
	open: boolean;
};

export type AccordionContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	{
		/**
		 * Whether to forcefully mount the content, regardless of the open state.
		 * This is useful if you want to use Svelte transitions for the content.
		 *
		 * @defaultValue `true`
		 */
		forceMount?: boolean;
	},
	AccordionContentSnippetProps
>;

export type AccordionContentProps = AccordionContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, AccordionContentPropsWithoutHTML>;

export type AccordionItemPropsWithoutHTML = WithChild<{
	/**
	 * The value of the accordion item. This is used to identify if the item is open or closed.
	 * If not provided, a unique ID will be generated for this value.
	 */
	value?: string;

	/**
	 * Whether the accordion item is disabled, which prevents users from interacting with it.
	 *
	 * @defaultValue `false`
	 */
	disabled?: boolean;
}>;

export type AccordionItemProps = AccordionItemPropsWithoutHTML & BitsPrimitiveDivAttributes;

export type AccordionHeaderPropsWithoutHTML = WithChild<{
	/**
	 * The level of the accordion header, applied to the element's `aria-level` attribute.
	 * This is used to indicate the hierarchical relationship between the accordion items.
	 *
	 * @defaultValue `3`
	 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;

export type AccordionHeaderProps = AccordionHeaderPropsWithoutHTML & BitsPrimitiveDivAttributes;
