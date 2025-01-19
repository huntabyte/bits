<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DismissibleLayerImplProps } from "./types.js";
	import { useDismissibleLayer } from "./use-dismissable-layer.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		interactOutsideBehavior = "close",
		onInteractOutside = noop,
		onFocusOutside = noop,
		id,
		children,
		enabled,
		isValidEvent = () => false,
	}: DismissibleLayerImplProps = $props();

	const dismissibleLayerState = useDismissibleLayer({
		id: box.with(() => id),
		interactOutsideBehavior: box.with(() => interactOutsideBehavior),
		onInteractOutside: box.with(() => onInteractOutside),
		enabled: box.with(() => enabled),
		onFocusOutside: box.with(() => onFocusOutside),
		isValidEvent: box.with(() => isValidEvent),
	});
</script>

{@render children?.({ props: dismissibleLayerState.props })}
