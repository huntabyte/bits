import type { EventCallback, OnChangeFn, WithChild, Without } from "$lib/internal/index.js";
import type { PrimitiveButtonAttributes, PrimitiveSpanAttributes } from "$lib/shared/attributes.js";

type SwitchRootSnippetProps = {
	checked: boolean;
};

export type SwitchRootPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the switch is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean | null | undefined;

		/**
		 * Whether the switch is required (for form validation).
		 *
		 * @defaultValue false
		 */
		required?: boolean;

		/**
		 * The name of the switch used in form submission.
		 * If not provided, the hidden input will not be rendered.
		 *
		 * @defaultValue undefined
		 */
		name?: string;

		/**
		 * The value of the switch used in form submission.
		 *
		 * @defaultValue undefined
		 */
		value?: string;

		/**
		 * The checked state of the switch.
		 *
		 * @defaultValue false
		 */
		checked?: boolean;

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean>;

		onclick?: EventCallback<MouseEvent>;

		onkeydown?: EventCallback<KeyboardEvent>;
	},
	SwitchRootSnippetProps
>;

export type SwitchRootProps = SwitchRootPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, SwitchRootPropsWithoutHTML>;

export type SwitchThumbSnippetProps = SwitchRootSnippetProps;

export type SwitchThumbPropsWithoutHTML = WithChild<{}, SwitchThumbSnippetProps>;

export type SwitchThumbProps = SwitchThumbPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SwitchThumbPropsWithoutHTML>;
