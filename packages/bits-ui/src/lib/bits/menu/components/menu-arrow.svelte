<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import type { MenuArrowProps } from "../types.js";
	import { useMenuArrow } from "../menu.svelte.js";
	import FloatingLayerArrow from "$lib/bits/utilities/floating-layer/components/floating-layer-arrow.svelte";

	let { ref = $bindable(null), ...restProps }: MenuArrowProps = $props();

	const arrowState = useMenuArrow();

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<FloatingLayerArrow bind:ref {...mergedProps} />
