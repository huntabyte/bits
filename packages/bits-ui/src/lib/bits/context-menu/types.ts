import type { MenuContentProps, MenuContentPropsWithoutHTML } from "../menu/types.js";
import type { WithChild, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type ContextMenuContentPropsWithoutHTML = Omit<
	MenuContentPropsWithoutHTML,
	"align" | "side" | "sideOffset"
>;

export type ContextMenuContentProps = Omit<
	MenuContentProps,
	"side" | "onOpenAutoFocus" | "sideOffset" | "align"
>;

export type ContextMenuTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the context menu trigger is disabled. If disabled, the trigger will not
	 * open the menu when right-clicked.
	 */
	disabled?: boolean;
}>;

export type ContextMenuTriggerProps = ContextMenuTriggerPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ContextMenuTriggerPropsWithoutHTML>;

export type {
	MenuArrowProps as ContextMenuArrowProps,
	MenuContentStaticProps as ContextMenuContentStaticProps,
	MenuCheckboxItemProps as ContextMenuCheckboxItemProps,
	MenuGroupProps as ContextMenuGroupProps,
	MenuItemProps as ContextMenuItemProps,
	MenuGroupHeadingProps as ContextMenuGroupHeadingProps,
	MenuRootProps as ContextMenuRootProps,
	MenuRadioGroupProps as ContextMenuRadioGroupProps,
	MenuRadioItemProps as ContextMenuRadioItemProps,
	MenuSeparatorProps as ContextMenuSeparatorProps,
	MenuSubContentProps as ContextMenuSubContentProps,
	MenuSubContentStaticProps as ContextMenuSubContentStaticProps,
	MenuSubProps as ContextMenuSubProps,
	MenuSubTriggerProps as ContextMenuSubTriggerProps,
	MenuPortalProps as ContextMenuPortalProps,
} from "$lib/bits/menu/types.js";

export type {
	MenuRootPropsWithoutHTML as ContextMenuRootPropsWithoutHTML,
	MenuContentStaticPropsWithoutHTML as ContextMenuContentStaticPropsWithoutHTML,
	MenuArrowPropsWithoutHTML as ContextMenuArrowPropsWithoutHTML,
	MenuCheckboxItemPropsWithoutHTML as ContextMenuCheckboxItemPropsWithoutHTML,
	MenuGroupPropsWithoutHTML as ContextMenuGroupPropsWithoutHTML,
	MenuItemPropsWithoutHTML as ContextMenuItemPropsWithoutHTML,
	MenuGroupHeadingPropsWithoutHTML as ContextMenuGroupHeadingPropsWithoutHTML,
	MenuRadioGroupPropsWithoutHTML as ContextMenuRadioGroupPropsWithoutHTML,
	MenuRadioItemPropsWithoutHTML as ContextMenuRadioItemPropsWithoutHTML,
	MenuSeparatorPropsWithoutHTML as ContextMenuSeparatorPropsWithoutHTML,
	MenuSubPropsWithoutHTML as ContextMenuSubPropsWithoutHTML,
	MenuSubTriggerPropsWithoutHTML as ContextMenuSubTriggerPropsWithoutHTML,
	MenuSubContentPropsWithoutHTML as ContextMenuSubContentPropsWithoutHTML,
	MenuSubContentStaticPropsWithoutHTML as ContextMenuSubContentStaticPropsWithoutHTML,
	MenuPortalPropsWithoutHTML as ContextMenuPortalPropsWithoutHTML,
} from "$lib/bits/menu/types.js";
