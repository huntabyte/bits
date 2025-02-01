import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type { DismissibleLayerProps } from "../utilities/dismissible-layer/types.js";
import type { PresenceLayerProps } from "../utilities/presence-layer/types.js";
import type { FocusScopeProps } from "../utilities/focus-scope/types.js";
import type { TextSelectionLayerProps } from "../utilities/text-selection-layer/types.js";
import type { ScrollLockProps } from "../utilities/scroll-lock/index.js";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";
import type { PortalProps } from "$lib/bits/utilities/portal/index.js";

export type DialogRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the dialog.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;
}>;

export type DialogRootProps = DialogRootPropsWithoutHTML;

export type DialogContentSnippetProps = {
	open: boolean;
};

export type DialogContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<
		EscapeLayerProps &
			Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
			PresenceLayerProps &
			FocusScopeProps &
			TextSelectionLayerProps &
			ScrollLockProps,
		"loop"
	>,
	DialogContentSnippetProps
>;

export type DialogContentProps = DialogContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DialogContentPropsWithoutHTML>;

export type DialogOverlaySnippetProps = {
	open: boolean;
};

export type DialogOverlayPropsWithoutHTML = WithChild<
	PresenceLayerProps,
	DialogOverlaySnippetProps
>;

export type DialogOverlayProps = DialogOverlayPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DialogOverlayPropsWithoutHTML>;

export type DialogPortalPropsWithoutHTML = PortalProps;
export type DialogPortalProps = DialogPortalPropsWithoutHTML;

export type DialogTriggerPropsWithoutHTML = WithChild;

export type DialogTriggerProps = DialogTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, DialogTriggerPropsWithoutHTML>;

export type DialogTitlePropsWithoutHTML = WithChild<{
	/**
	 * The heading level of the dialog title.
	 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;

export type DialogTitleProps = DialogTitlePropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DialogTitlePropsWithoutHTML>;

export type DialogClosePropsWithoutHTML = DialogTriggerPropsWithoutHTML;
export type DialogCloseProps = DialogTriggerProps;

export type DialogDescriptionPropsWithoutHTML = WithChild;
export type DialogDescriptionProps = DialogDescriptionPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DialogDescriptionPropsWithoutHTML>;
