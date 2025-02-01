export { default as Anchor } from "./floating-layer-anchor.svelte";
export { default as Arrow } from "./floating-layer-arrow.svelte";
export { default as Content } from "./floating-layer-content.svelte";
export { default as ContentStatic } from "./floating-layer-content-static.svelte";
export { default as Root } from "./floating-layer.svelte";

export type {
	FloatingLayerContentImplProps as ContentImplProps,
	FloatingLayerContentProps as ContentProps,
	FloatingLayerAnchorProps as AnchorProps,
} from "../types.js";
