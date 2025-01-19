import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";

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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value?: any;

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
	},
	SwitchRootSnippetProps
>;

export type SwitchRootProps = SwitchRootPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, SwitchRootPropsWithoutHTML>;

export type SwitchThumbSnippetProps = SwitchRootSnippetProps;

export type SwitchThumbPropsWithoutHTML = WithChild<{}, SwitchThumbSnippetProps>;

export type SwitchThumbProps = SwitchThumbPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SwitchThumbPropsWithoutHTML>;
