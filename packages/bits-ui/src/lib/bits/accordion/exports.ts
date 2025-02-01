export { default as Root } from "./components/accordion.svelte";
export { default as Item } from "./components/accordion-item.svelte";
export { default as Header } from "./components/accordion-header.svelte";
export { default as Trigger } from "./components/accordion-trigger.svelte";
export { default as Content } from "./components/accordion-content.svelte";

export type {
	AccordionRootProps as RootProps,
	AccordionItemProps as ItemProps,
	AccordionHeaderProps as HeaderProps,
	AccordionTriggerProps as TriggerProps,
	AccordionContentProps as ContentProps,
} from "./types.js";
