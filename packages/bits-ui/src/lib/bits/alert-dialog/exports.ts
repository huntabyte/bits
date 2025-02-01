export { default as Root } from "./components/alert-dialog.svelte";
export { default as Title } from "$lib/bits/dialog/components/dialog-title.svelte";
export { default as Action } from "./components/alert-dialog-action.svelte";
export { default as Cancel } from "./components/alert-dialog-cancel.svelte";
export { default as Portal } from "$lib/bits/utilities/portal/portal.svelte";
export { default as Content } from "./components/alert-dialog-content.svelte";
export { default as Overlay } from "$lib/bits/dialog/components/dialog-overlay.svelte";
export { default as Trigger } from "$lib/bits/dialog/components/dialog-trigger.svelte";
export { default as Description } from "$lib/bits/dialog/components/dialog-description.svelte";

export type {
	AlertDialogRootProps as RootProps,
	AlertDialogTitleProps as TitleProps,
	AlertDialogActionProps as ActionProps,
	AlertDialogCancelProps as CancelProps,
	AlertDialogPortalProps as PortalProps,
	AlertDialogContentProps as ContentProps,
	AlertDialogOverlayProps as OverlayProps,
	AlertDialogTriggerProps as TriggerProps,
	AlertDialogDescriptionProps as DescriptionProps,
} from "./types.js";
