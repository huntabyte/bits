export { default as Root } from "./components/scroll-area.svelte";
export { default as Viewport } from "./components/scroll-area-viewport.svelte";
export { default as Scrollbar } from "./components/scroll-area-scrollbar.svelte";
export { default as Thumb } from "./components/scroll-area-thumb.svelte";
export { default as Corner } from "./components/scroll-area-corner.svelte";

export type {
	ScrollAreaRootProps as RootProps,
	ScrollAreaViewportProps as ViewportProps,
	ScrollAreaScrollbarProps as ScrollbarProps,
	ScrollAreaThumbProps as ThumbProps,
	ScrollAreaCornerProps as CornerProps,
} from "./types.js";
