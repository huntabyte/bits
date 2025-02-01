import type { ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { MenuArrowProps } from "../menu/types.js";
import type { OnChangeFn, WithChild, WithChildren, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";
import type { Direction } from "$lib/shared/index.js";

export type MenubarRootPropsWithoutHTML = WithChild<{
	/**
	 * The reading direction of the menubar.
	 */
	dir?: Direction;

	/**
	 * When `true`, the roving focus will loop back to the first menu item when the last
	 * menu item is reached and vice verse.
	 */
	loop?: boolean;

	/**
	 * The 'value' assigned to the currently active menu in the menubar.
	 */
	value?: string;

	/**
	 * A callback that is called when the active menu changes.
	 */
	onValueChange?: OnChangeFn<string>;
}>;

export type MenubarRootProps = MenubarRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenubarRootPropsWithoutHTML>;

export type MenubarMenuPropsWithoutHTML = WithChildren<{
	/**
	 * The `value` assigned to the menu. Used to programmatically control the menu's open state
	 * within the menubar.
	 */
	value?: string;
}>;

export type MenubarMenuProps = MenubarMenuPropsWithoutHTML;

export type MenubarTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger for the menubar item is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type MenubarTriggerProps = MenubarTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, MenubarTriggerPropsWithoutHTML>;

export type {
	MenuContentPropsWithoutHTML as MenubarContentPropsWithoutHTML,
	MenuContentProps as MenubarContentProps,
	MenuContentStaticPropsWithoutHTML as MenubarContentStaticPropsWithoutHTML,
	MenuContentStaticProps as MenubarContentStaticProps,
	MenuItemPropsWithoutHTML as MenubarItemPropsWithoutHTML,
	MenuItemProps as MenubarItemProps,
	MenuGroupPropsWithoutHTML as MenubarGroupPropsWithoutHTML,
	MenuGroupProps as MenubarGroupProps,
	MenuGroupHeadingPropsWithoutHTML as MenubarGroupHeadingPropsWithoutHTML,
	MenuGroupHeadingProps as MenubarGroupHeadingProps,
	MenuCheckboxItemPropsWithoutHTML as MenubarCheckboxItemPropsWithoutHTML,
	MenuCheckboxItemProps as MenubarCheckboxItemProps,
	MenuRadioGroupPropsWithoutHTML as MenubarRadioGroupPropsWithoutHTML,
	MenuRadioGroupProps as MenubarRadioGroupProps,
	MenuRadioItemPropsWithoutHTML as MenubarRadioItemPropsWithoutHTML,
	MenuRadioItemProps as MenubarRadioItemProps,
	MenuSeparatorPropsWithoutHTML as MenubarSeparatorPropsWithoutHTML,
	MenuSeparatorProps as MenubarSeparatorProps,
	MenuSubContentPropsWithoutHTML as MenubarSubContentPropsWithoutHTML,
	MenuSubContentProps as MenubarSubContentProps,
	MenuSubContentStaticPropsWithoutHTML as MenubarSubContentStaticPropsWithoutHTML,
	MenuSubContentStaticProps as MenubarSubContentStaticProps,
	MenuSubTriggerPropsWithoutHTML as MenubarSubTriggerPropsWithoutHTML,
	MenuSubTriggerProps as MenubarSubTriggerProps,
	MenuSubPropsWithoutHTML as MenubarSubPropsWithoutHTML,
	MenuPortalPropsWithoutHTML as MenubarPortalPropsWithoutHTML,
	MenuPortalProps as MenubarPortalProps,
} from "../menu/types.js";

export type MenubarArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type MenubarArrowProps = MenuArrowProps;
