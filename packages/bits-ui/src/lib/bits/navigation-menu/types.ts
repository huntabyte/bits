import type { InteractOutsideEvent } from "../utilities/dismissable-layer/types.js";
import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	PrimitiveAnchorAttributes,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	PrimitiveElementAttributes,
	PrimitiveLiAttributes,
	PrimitiveUListAttributes,
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
	 * Whether or not the value state is controlled or not. If `true`, the component will not update
	 * the value state internally, instead it will call `onValueChange` when it would have
	 * otherwise, and it is up to you to update the `value` prop that is passed to the component.
	 */
	controlledValue?: boolean;

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
	Without<PrimitiveElementAttributes, NavigationMenuRootPropsWithoutHTML>;

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
	Without<PrimitiveDivAttributes, NavigationMenuSubPropsWithoutHTML>;

export type NavigationMenuListPropsWithoutHTML = WithChild;

export type NavigationMenuListProps = NavigationMenuListPropsWithoutHTML &
	Without<PrimitiveUListAttributes, NavigationMenuListPropsWithoutHTML>;

export type NavigationMenuItemPropsWithoutHTML = WithChild<{
	/**
	 * The value of the menu item.
	 */
	value?: string;
}>;

export type NavigationMenuItemProps = NavigationMenuItemPropsWithoutHTML &
	Without<PrimitiveLiAttributes, NavigationMenuItemPropsWithoutHTML>;

export type NavigationMenuTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger is disabled.
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type NavigationMenuTriggerProps = NavigationMenuTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, NavigationMenuTriggerPropsWithoutHTML>;

export type NavigationMenuContentPropsWithoutHTML = WithChild<{
	/**
	 * Callback fired when an interaction occurs outside the content.
	 * Default behavior can be prevented with `event.preventDefault()`
	 *
	 */
	onInteractOutside?: (event: InteractOutsideEvent) => void;

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
	Without<PrimitiveDivAttributes, NavigationMenuContentPropsWithoutHTML>;

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
	Without<PrimitiveAnchorAttributes, NavigationMenuLinkPropsWithoutHTML>;

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
	Without<PrimitiveDivAttributes, NavigationMenuIndicatorPropsWithoutHTML>;

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
	Without<PrimitiveDivAttributes, NavigationMenuViewportPropsWithoutHTML>;
