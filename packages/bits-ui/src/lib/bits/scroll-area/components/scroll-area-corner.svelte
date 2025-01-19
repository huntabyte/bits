<script lang="ts">
	import type { ScrollAreaCornerProps } from "../types.js";
	import { ScrollAreaRootContext } from "../scroll-area.svelte.js";
	import ScrollAreaCornerImpl from "./scroll-area-corner-impl.svelte";
	import { useId } from "$lib/internal/use-id.js";

	let { ref = $bindable(null), id = useId(), ...restProps }: ScrollAreaCornerProps = $props();

	const scrollAreaState = ScrollAreaRootContext.get();

	const hasBothScrollbarsVisible = $derived(
		Boolean(scrollAreaState.scrollbarXNode && scrollAreaState.scrollbarYNode)
	);
	const hasCorner = $derived(
		scrollAreaState.type.current !== "scroll" && hasBothScrollbarsVisible
	);
</script>

{#if hasCorner}
	<ScrollAreaCornerImpl {...restProps} {id} bind:ref />
{/if}
