import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveButtonAttributes } from "$lib/shared/attributes.js";

export type ToggleRootSnippetProps = {
	pressed: boolean;
};

export type ToggleRootPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the toggle is pressed or not.
		 *
		 * @defaultValue false
		 */
		pressed?: boolean | undefined;

		/**
		 * A callback function called when the toggle is pressed.
		 */
		onPressedChange?: OnChangeFn<boolean>;

		/**
		 * Whether the toggle is disabled or not.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean | null | undefined;
	},
	ToggleRootSnippetProps
>;

export type ToggleRootProps = ToggleRootPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, ToggleRootPropsWithoutHTML>;
