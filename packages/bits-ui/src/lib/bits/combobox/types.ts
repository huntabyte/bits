import type { BitsPrimitiveInputAttributes } from "$lib/shared/attributes.js";
import type { WithChild, Without } from "$lib/internal/types.js";

export type {
	SelectBaseRootPropsWithoutHTML as ComboboxBaseRootPropsWithoutHTML,
	SelectContentProps as ComboboxContentProps,
	SelectContentPropsWithoutHTML as ComboboxContentPropsWithoutHTML,
	SelectContentStaticProps as ComboboxContentStaticProps,
	SelectContentStaticPropsWithoutHTML as ComboboxContentStaticPropsWithoutHTML,
	SelectItemProps as ComboboxItemProps,
	SelectItemPropsWithoutHTML as ComboboxItemPropsWithoutHTML,
	SelectItemSnippetProps as ComboboxItemSnippetProps,
	SelectMultipleRootProps as ComboboxMultipleRootProps,
	SelectMultipleRootPropsWithoutHTML as ComboboxMultipleRootPropsWithoutHTML,
	SelectRootProps as ComboboxRootProps,
	SelectRootPropsWithoutHTML as ComboboxRootPropsWithoutHTML,
	SelectSingleRootProps as ComboboxSingleRootProps,
	SelectSingleRootPropsWithoutHTML as ComboboxSingleRootPropsWithoutHTML,
	SelectTriggerProps as ComboboxTriggerProps,
	SelectTriggerPropsWithoutHTML as ComboboxTriggerPropsWithoutHTML,
	SelectGroupPropsWithoutHTML as ComboboxGroupPropsWithoutHTML,
	SelectGroupProps as ComboboxGroupProps,
	SelectGroupHeadingPropsWithoutHTML as ComboboxGroupHeadingPropsWithoutHTML,
	SelectGroupHeadingProps as ComboboxGroupHeadingProps,
	SelectViewportPropsWithoutHTML as ComboboxViewportPropsWithoutHTML,
	SelectViewportProps as ComboboxViewportProps,
	SelectScrollDownButtonProps as ComboboxScrollDownButtonProps,
	SelectScrollDownButtonPropsWithoutHTML as ComboboxScrollDownButtonPropsWithoutHTML,
	SelectScrollUpButtonProps as ComboboxScrollUpButtonProps,
	SelectScrollUpButtonPropsWithoutHTML as ComboboxScrollUpButtonPropsWithoutHTML,
	SelectArrowProps as ComboboxArrowProps,
	SelectArrowPropsWithoutHTML as ComboboxArrowPropsWithoutHTML,
	SelectPortalProps as ComboboxPortalProps,
	SelectPortalPropsWithoutHTML as ComboboxPortalPropsWithoutHTML,
} from "$lib/bits/select/types.js";

export type ComboboxInputPropsWithoutHTML = WithChild<{
	/**
	 * The default value of the input. This is not a reactive prop and is only used to populate
	 * the input when the combobox is first mounted if there is already a value set.
	 */
	defaultValue?: string;
}>;

export type ComboboxInputProps = ComboboxInputPropsWithoutHTML &
	Without<Omit<BitsPrimitiveInputAttributes, "value">, ComboboxInputPropsWithoutHTML>;
