export { default as Root } from "./components/collapsible.svelte";
export { default as Content } from "./components/collapsible-content.svelte";
export { default as Trigger } from "./components/collapsible-trigger.svelte";

export type {
	CollapsibleRootProps as RootProps,
	CollapsibleContentProps as ContentProps,
	CollapsibleTriggerProps as TriggerProps,
} from "./types.js";
