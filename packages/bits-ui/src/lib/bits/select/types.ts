import type { Expand } from "svelte-toolbelt";
import type { PortalProps } from "../utilities/portal/types.js";
import type { PopperLayerProps, PopperLayerStaticProps } from "../utilities/popper-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type {
	BitsPrimitiveButtonAttributes,
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

export type SelectBaseRootPropsWithoutHTML = WithChildren<{
	/**
	 * Whether the combobox is disabled.
	 *
	 * @defaultValue `false`
	 */
	disabled?: boolean;

	/**
	 * Whether the combobox is required (for form submission).
	 *
	 * @defaultValue `false`
	 */
	required?: boolean;

	/**
	 * The name to apply to the hidden input element for form submission.
	 * If not provided, a hidden input will not be rendered and the combobox will not be part of a form.
	 */
	name?: string;

	/**
	 * Whether the combobox popover is open.
	 *
	 * @defaultValue `false`
	 * @bindable
	 */
	open?: boolean;

	/**
	 * A callback function called when the open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * Whether or not the combobox menu should loop through the items when navigating with the keyboard.
	 *
	 * @defaultValue `false`
	 */
	loop?: boolean;

	/**
	 * How to scroll the combobox items into view when navigating with the keyboard.
	 *
	 * @defaultValue `"nearest"`
	 */
	scrollAlignment?: "nearest" | "center";

	/**
	 * Optionally provide an array of `value` and `label` pairs that will be used to match
	 * and trigger selection when the trigger is focused and a key is pressed while the content
	 * is closed. It's also used to handle form autofill.
	 *
	 * By providing this value, you enable selecting a value when the trigger is focused and a key
	 * is pressed without the content being open, similar to how a native `<select>` works.
	 * For this to work, you must
	 *
	 * The label is what the user will potentially search for via typeahead, and the value is what
	 * is set as the selected value when a typeahead match is found.
	 *
	 * We can't rely on the individual `Item` components to do this because they may not ever be
	 * mounted to do the DOM if using a conditional block with a Svelte transition or certain
	 * animation libraries.
	 *
	 * IMPORTANT: This functionality is only available for single-select listboxes.
	 */
	items?: { value: string; label: string; disabled?: boolean }[];

	/**
	 * Whether to allow the user to deselect an item by clicking on an already selected item.
	 * This is only applicable to `type="single"` selects/comboboxes.
	 */
	allowDeselect?: boolean;
}>;

export type SelectSingleRootPropsWithoutHTML = {
	/**
	 * The value of the selected combobox item.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The type of combobox.
	 *
	 * @required
	 */
	type: "single";
};

export type SelectMultipleRootPropsWithoutHTML = {
	/**
	 * The value of the selected combobox item.
	 *
	 * @bindable
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;

	/**
	 * The type of combobox.
	 *
	 * @required
	 */
	type: "multiple";
};

export type SelectSingleRootProps = SelectBaseRootPropsWithoutHTML &
	SelectSingleRootPropsWithoutHTML &
	Without<
		BitsPrimitiveDivAttributes,
		SelectSingleRootPropsWithoutHTML | SelectBaseRootPropsWithoutHTML
	>;

export type SelectMultipleRootProps = SelectBaseRootPropsWithoutHTML &
	SelectMultipleRootPropsWithoutHTML &
	Without<
		BitsPrimitiveDivAttributes,
		SelectMultipleRootPropsWithoutHTML | SelectBaseRootPropsWithoutHTML
	>;

export type SelectRootPropsWithoutHTML = SelectBaseRootPropsWithoutHTML &
	(SelectSingleRootPropsWithoutHTML | SelectMultipleRootPropsWithoutHTML);

export type SelectRootProps = SelectRootPropsWithoutHTML;

export type _SharedSelectContentProps = {
	/**
	 * Whether or not to loop through the items when navigating with the keyboard.
	 *
	 * @defaultValue `false`
	 */
	loop?: boolean;
};

export type SelectContentPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerProps, "content" | "onOpenAutoFocus" | "trapFocus"> &
			_SharedSelectContentProps,
		FloatingContentSnippetProps
	>
>;

export type SelectContentProps = SelectContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectContentPropsWithoutHTML>;

export type SelectContentStaticPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerStaticProps, "content" | "onOpenAutoFocus" | "trapFocus"> &
			_SharedSelectContentProps,
		StaticContentSnippetProps
	>
>;

export type SelectContentStaticProps = SelectContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectContentStaticPropsWithoutHTML>;

export type SelectTriggerPropsWithoutHTML = WithChild;

export type SelectTriggerProps = SelectTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, SelectTriggerPropsWithoutHTML>;

export type SelectItemSnippetProps = { selected: boolean; highlighted: boolean };

export type SelectItemPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the item.
		 *
		 * @required
		 */
		value: string;

		/**
		 * The label of the item. If provided, this is the item that users will search for.
		 * If not provided, the value will be used as the label.
		 */
		label?: string;

		/**
		 * Whether the item is disabled.
		 *
		 * @defaultValue `false`
		 */
		disabled?: boolean;

		/**
		 * A callback function called when the item is highlighted. This can be used as a
		 * replacement for `onfocus` since we don't actually focus the item and instead
		 * rely on the `aria-activedescendant` attribute to indicate the highlighted item.
		 */
		onHighlight?: () => void;

		/**
		 * A callback function called when the item is unhighlighted. This can be used as a
		 * replacement for `onblur` since we don't actually focus the item and instead
		 * rely on the `aria-activedescendant` attribute to indicate the highlighted item.
		 */
		onUnhighlight?: () => void;
	},
	SelectItemSnippetProps
>;

export type SelectItemProps = SelectItemPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectItemPropsWithoutHTML>;

export type SelectGroupPropsWithoutHTML = WithChild;

export type SelectGroupProps = SelectGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectGroupPropsWithoutHTML>;

export type SelectGroupHeadingPropsWithoutHTML = WithChild;

export type SelectGroupHeadingProps = SelectGroupHeadingPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectGroupHeadingPropsWithoutHTML>;

export type SelectSeparatorPropsWithoutHTML = WithChild;

export type SelectSeparatorProps = SelectSeparatorPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectSeparatorPropsWithoutHTML>;

export type SelectPortalPropsWithoutHTML = PortalProps;

export type SelectPortalProps = SelectPortalPropsWithoutHTML;

export type SelectArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type SelectArrowProps = ArrowProps;

export type SelectViewportPropsWithoutHTML = WithChild;

export type SelectViewportProps = SelectViewportPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectViewportPropsWithoutHTML>;

export type SelectScrollUpButtonPropsWithoutHTML = WithChild;

export type SelectScrollUpButtonProps = SelectScrollUpButtonPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectScrollUpButtonPropsWithoutHTML>;

export type SelectScrollDownButtonPropsWithoutHTML = WithChild;

export type SelectScrollDownButtonProps = SelectScrollDownButtonPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, SelectScrollDownButtonPropsWithoutHTML>;
