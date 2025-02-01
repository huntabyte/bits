export { default as Root } from "./components/popover.svelte";
export { default as Arrow } from "./components/popover-arrow.svelte";
export { default as Content } from "./components/popover-content.svelte";
export { default as ContentStatic } from "./components/popover-content-static.svelte";
export { default as Trigger } from "./components/popover-trigger.svelte";
export { default as Close } from "./components/popover-close.svelte";
export { default as Portal } from "$lib/bits/utilities/portal/portal.svelte";

export type {
	PopoverRootProps as RootProps,
	PopoverArrowProps as ArrowProps,
	PopoverContentProps as ContentProps,
	PopoverContentStaticProps as ContentStaticProps,
	PopoverTriggerProps as TriggerProps,
	PopoverCloseProps as CloseProps,
} from "./types.js";

export type { PortalProps } from "$lib/bits/utilities/portal/types.js";
