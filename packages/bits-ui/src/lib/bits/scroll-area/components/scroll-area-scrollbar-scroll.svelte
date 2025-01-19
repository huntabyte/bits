<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { useScrollAreaScrollbarScroll } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarVisible from "./scroll-area-scrollbar-visible.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarScrollState = useScrollAreaScrollbarScroll();

	const mergedProps = $derived(mergeProps(restProps, scrollbarScrollState.props));
</script>

<PresenceLayer {...mergedProps} present={forceMount || !scrollbarScrollState.isHidden}>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
