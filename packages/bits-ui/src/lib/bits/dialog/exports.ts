export { default as Root } from "./components/dialog.svelte";
export { default as Title } from "./components/dialog-title.svelte";
export { default as Close } from "./components/dialog-close.svelte";
export { default as Portal } from "$lib/bits/utilities/portal/portal.svelte";
export { default as Content } from "./components/dialog-content.svelte";
export { default as Overlay } from "./components/dialog-overlay.svelte";
export { default as Trigger } from "./components/dialog-trigger.svelte";
export { default as Description } from "./components/dialog-description.svelte";

export type {
	DialogRootProps as RootProps,
	DialogTitleProps as TitleProps,
	DialogCloseProps as CloseProps,
	DialogPortalProps as PortalProps,
	DialogContentProps as ContentProps,
	DialogOverlayProps as OverlayProps,
	DialogTriggerProps as TriggerProps,
	DialogDescriptionProps as DescriptionProps,
} from "./types.js";
