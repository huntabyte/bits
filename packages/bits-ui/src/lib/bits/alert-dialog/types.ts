import type { DialogContentProps, DialogContentPropsWithoutHTML } from "$lib/types.js";

export type {
	DialogRootPropsWithoutHTML as AlertDialogRootPropsWithoutHTML,
	DialogRootProps as AlertDialogRootProps,
	DialogClosePropsWithoutHTML as AlertDialogActionPropsWithoutHTML,
	DialogCloseProps as AlertDialogActionProps,
	DialogClosePropsWithoutHTML as AlertDialogCancelPropsWithoutHTML,
	DialogCloseProps as AlertDialogCancelProps,
	DialogPortalPropsWithoutHTML as AlertDialogPortalPropsWithoutHTML,
	DialogPortalProps as AlertDialogPortalProps,
	DialogOverlayPropsWithoutHTML as AlertDialogOverlayPropsWithoutHTML,
	DialogOverlayProps as AlertDialogOverlayProps,
	DialogTitlePropsWithoutHTML as AlertDialogTitlePropsWithoutHTML,
	DialogTitleProps as AlertDialogTitleProps,
	DialogDescriptionPropsWithoutHTML as AlertDialogDescriptionPropsWithoutHTML,
	DialogDescriptionProps as AlertDialogDescriptionProps,
	DialogTriggerPropsWithoutHTML as AlertDialogTriggerPropsWithoutHTML,
	DialogTriggerProps as AlertDialogTriggerProps,
} from "$lib/bits/dialog/types.js";

export type AlertDialogContentPropsWithoutHTML = Omit<
	DialogContentPropsWithoutHTML,
	"onInteractOutside"
>;
export type AlertDialogContentProps = DialogContentProps;
