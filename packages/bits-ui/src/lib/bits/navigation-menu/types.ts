import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveAnchorAttributes,
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
	BitsPrimitiveElementAttributes,
	BitsPrimitiveLiAttributes,
	BitsPrimitiveUListAttributes,
} from "$lib/shared/attributes.js";
import type { Direction, Orientation } from "$lib/shared/index.js";

export type NavigationMenuRootPropsWithoutHTML = WithChild<{
	/**
	 * The value of the currently open menu item.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * The callback to call when a menu item is selected.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The duration from when the mouse enters a trigger until the content opens.
	 *
	 * @defaultValue 200
	 */
	delayDuration?: number;

	/**
	 * How much time a user has to enter another trigger without incurring a delay again.
	 *
	 * @defaultValue 300
	 */
	skipDelayDuration?: number;

	/**
	 * The reading direction of the content.
	 *
	 * @defaultValue "ltr"
	 */
	dir?: Direction;

	/**
	 * The orientation of the menu.
	 */
	orientation?: Orientation;
}>;

export type NavigationMenuRootProps = NavigationMenuRootPropsWithoutHTML &
	Without<BitsPrimitiveElementAttributes, NavigationMenuRootPropsWithoutHTML>;

export type NavigationMenuSubPropsWithoutHTML = WithChild<{
	/**
	 * The value of the currently open menu item within the menu.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * A callback fired when the active menu item changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The orientation of the menu.
	 */
	orientation?: Orientation;
}>;

export type NavigationMenuSubProps = NavigationMenuSubPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, NavigationMenuSubPropsWithoutHTML>;

export type NavigationMenuListPropsWithoutHTML = WithChild;

export type NavigationMenuListProps = NavigationMenuListPropsWithoutHTML &
	Without<BitsPrimitiveUListAttributes, NavigationMenuListPropsWithoutHTML>;

export type NavigationMenuItemPropsWithoutHTML = WithChild<{
	/**
	 * The value of the menu item.
	 */
	value?: string;
}>;

export type NavigationMenuItemProps = NavigationMenuItemPropsWithoutHTML &
	Without<BitsPrimitiveLiAttributes, NavigationMenuItemPropsWithoutHTML>;

export type NavigationMenuTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger is disabled.
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type NavigationMenuTriggerProps = NavigationMenuTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, NavigationMenuTriggerPropsWithoutHTML>;

export type NavigationMenuContentPropsWithoutHTML = WithChild<{
	/**
	 * Callback fired when an interaction occurs outside the content.
	 * Default behavior can be prevented with `event.preventDefault()`
	 *
	 */
	onInteractOutside?: (event: PointerEvent) => void;

	/**
	 * Callback fired when a focus event occurs outside the content.
	 * Default behavior can be prevented with `event.preventDefault()`
	 */
	onFocusOutside?: (event: FocusEvent) => void;

	/**
	 * Callback fires when an escape keydown event occurs.
	 * Default behavior can be prevented with `event.preventDefault()`
	 */
	onEscapeKeydown?: (event: KeyboardEvent) => void;

	/**
	 * Whether to forcefully mount the content, regardless of the open state.
	 * This is useful when wanting to use more custom transition and animation
	 * libraries.
	 *
	 * @defaultValue false
	 */
	forceMount?: boolean;
}>;

export type NavigationMenuContentProps = NavigationMenuContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, NavigationMenuContentPropsWithoutHTML>;

export type NavigationMenuLinkPropsWithoutHTML = WithChild<{
	/**
	 * Whether the link is the current active page
	 */
	active?: boolean;

	/**
	 * A callback fired when the link is clicked.
	 * Default behavior can be prevented with `event.preventDefault()`
	 */
	onSelect?: (e: Event) => void;
}>;

export type NavigationMenuLinkProps = NavigationMenuLinkPropsWithoutHTML &
	Without<BitsPrimitiveAnchorAttributes, NavigationMenuLinkPropsWithoutHTML>;

export type NavigationMenuIndicatorPropsWithoutHTML = WithChild<{
	/**
	 * Whether to forcefully mount the content, regardless of the open state.
	 * This is useful when wanting to use more custom transition and animation
	 * libraries.
	 *
	 * @defaultValue false
	 */
	forceMount?: boolean;
}>;

export type NavigationMenuIndicatorProps = NavigationMenuIndicatorPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, NavigationMenuIndicatorPropsWithoutHTML>;

export type NavigationMenuViewportPropsWithoutHTML = WithChild<{
	/**
	 * Whether to forcefully mount the content, regardless of the open state.
	 * This is useful when wanting to use more custom transition and animation
	 * libraries.
	 *
	 * @defaultValue false
	 */
	forceMount?: boolean;
}>;

export type NavigationMenuViewportProps = NavigationMenuViewportPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, NavigationMenuViewportPropsWithoutHTML>;
