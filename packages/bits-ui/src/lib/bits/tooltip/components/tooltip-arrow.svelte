<script lang="ts">
	import type { TooltipArrowProps } from "../types.js";
	import FloatingLayerArrow from "$lib/bits/utilities/floating-layer/components/floating-layer-arrow.svelte";

	let { ref = $bindable(null), ...restProps }: TooltipArrowProps = $props();
</script>

<FloatingLayerArrow bind:ref {...restProps} />
