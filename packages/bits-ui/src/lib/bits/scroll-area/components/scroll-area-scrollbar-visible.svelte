<script lang="ts">
	import { useScrollAreaScrollbarVisible } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarX from "./scroll-area-scrollbar-x.svelte";
	import ScrollAreaScrollbarY from "./scroll-area-scrollbar-y.svelte";

	let { ...restProps }: Omit<_ScrollbarStubProps, "forceMount"> = $props();

	const scrollbarVisibleState = useScrollAreaScrollbarVisible();
</script>

{#if scrollbarVisibleState.scrollbar.orientation.current === "horizontal"}
	<ScrollAreaScrollbarX {...restProps} />
{:else}
	<ScrollAreaScrollbarY {...restProps} />
{/if}
