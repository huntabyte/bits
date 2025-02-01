export { default as Root } from "./components/tabs.svelte";
export { default as Content } from "./components/tabs-content.svelte";
export { default as List } from "./components/tabs-list.svelte";
export { default as Trigger } from "./components/tabs-trigger.svelte";

export type {
	TabsRootProps as RootProps,
	TabsContentProps as ContentProps,
	TabsTriggerProps as TriggerProps,
	TabsListProps as ListProps,
} from "./types.js";
