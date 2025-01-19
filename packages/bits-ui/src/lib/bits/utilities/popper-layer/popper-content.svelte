<script lang="ts">
	import FloatingLayerContentStatic from "../floating-layer/components/floating-layer-content-static.svelte";
	import FloatingLayerContent from "../floating-layer/components/floating-layer-content.svelte";
	import type { FloatingLayerContentImplProps } from "../floating-layer/types.js";

	let {
		content,
		isStatic = false,
		onPlaced,
		...restProps
	}: FloatingLayerContentImplProps & { isStatic: boolean } = $props();
</script>

{#if isStatic}
	<FloatingLayerContentStatic {content} {onPlaced} />
{:else}
	<FloatingLayerContent {content} {onPlaced} {...restProps} />
{/if}
