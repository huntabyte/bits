<script lang="ts">
	import type { PopoverArrowProps } from "../types.js";
	import FloatingLayerArrow from "$lib/bits/utilities/floating-layer/components/floating-layer-arrow.svelte";

	let { ref = $bindable(null), ...restProps }: PopoverArrowProps = $props();
</script>

<FloatingLayerArrow bind:ref {...restProps} data-popover-arrow="" />
