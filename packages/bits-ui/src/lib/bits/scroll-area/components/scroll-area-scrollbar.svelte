<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ScrollAreaScrollbarProps } from "../types.js";
	import { useScrollAreaScrollbar } from "../scroll-area.svelte.js";
	import ScrollAreaScrollbarAuto from "./scroll-area-scrollbar-auto.svelte";
	import ScrollAreaScrollbarScroll from "./scroll-area-scrollbar-scroll.svelte";
	import ScrollAreaScrollbarHover from "./scroll-area-scrollbar-hover.svelte";
	import ScrollAreaScrollbarVisible from "./scroll-area-scrollbar-visible.svelte";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		orientation,
		...restProps
	}: ScrollAreaScrollbarProps = $props();

	const scrollbarState = useScrollAreaScrollbar({
		orientation: box.with(() => orientation),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const type = $derived(scrollbarState.root.type.current);
</script>

{#if type === "hover"}
	<ScrollAreaScrollbarHover {...restProps} {id} />
{:else if type === "scroll"}
	<ScrollAreaScrollbarScroll {...restProps} {id} />
{:else if type === "auto"}
	<ScrollAreaScrollbarAuto {...restProps} {id} />
{:else if type === "always"}
	<ScrollAreaScrollbarVisible {...restProps} {id} />
{/if}
