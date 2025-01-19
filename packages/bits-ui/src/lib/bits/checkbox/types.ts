import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
	BitsPrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";

export type CheckboxRootSnippetProps = { checked: boolean; indeterminate: boolean };

export type CheckboxRootPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the checkbox is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean | null | undefined;

		/**
		 * Whether the checkbox is required (for form validation).
		 *
		 * @defaultValue false
		 */
		required?: boolean;

		/**
		 * The name of the checkbox used in form submission.
		 * If not provided, the hidden input will not be rendered.
		 *
		 * @defaultValue undefined
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name?: any;

		/**
		 * The value of the checkbox used in form submission and to identify
		 * the checkbox when in a `Checkbox.Group`. If not provided while in a
		 * `Checkbox.Group`, the checkbox will use a random identifier.
		 *
		 * @defaultValue undefined
		 */
		value?: string;

		/**
		 * The checked state of the checkbox. It can be one of:
		 * - `true` for checked
		 * - `false` for unchecked
		 *
		 * @defaultValue false
		 */
		checked?: boolean;

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean>;

		/**
		 * Whether the checkbox is in an indeterminate state or not.
		 *
		 * @defaultValue false
		 */
		indeterminate?: boolean;

		/**
		 * A callback function called when the indeterminate state changes.
		 */
		onIndeterminateChange?: OnChangeFn<boolean>;
	},
	CheckboxRootSnippetProps
>;

export type CheckboxRootProps = CheckboxRootPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, CheckboxRootPropsWithoutHTML>;

export type CheckboxGroupPropsWithoutHTML = WithChild<{
	/**
	 * Whether the checkbox group is disabled.
	 * This will disable all checkboxes in the group.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;

	/**
	 * Whether the checkbox group is required (for form validation).
	 * This will mark all checkboxes in the group as required.
	 *
	 * @defaultValue false
	 */
	required?: boolean;

	/**
	 * The name of the checkbox used in form submission.
	 * If not provided, the hidden input will not be rendered.
	 * This will be used as the name for all checkboxes in the group.
	 *
	 * @defaultValue undefined
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	name?: any;

	/**
	 * The value of the checkbox group, indicating which
	 * of the checkboxes in the group are checked.
	 *
	 * @bindable
	 * @defaultValue []
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;
}>;

export type CheckboxGroupProps = CheckboxGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CheckboxGroupPropsWithoutHTML>;

export type CheckboxGroupLabelPropsWithoutHTML = WithChild;

export type CheckboxGroupLabelProps = CheckboxGroupLabelPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, CheckboxGroupLabelPropsWithoutHTML>;
