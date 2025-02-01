<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TextSelectionLayerImplProps } from "./types.js";
	import { useTextSelectionLayer } from "./use-text-selection-layer.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		preventOverflowTextSelection = true,
		onPointerDown = noop,
		onPointerUp = noop,
		id,
		children,
		enabled,
	}: TextSelectionLayerImplProps = $props();

	useTextSelectionLayer({
		id: box.with(() => id),
		preventOverflowTextSelection: box.with(() => preventOverflowTextSelection),
		onPointerDown: box.with(() => onPointerDown),
		onPointerUp: box.with(() => onPointerUp),
		enabled: box.with(() => enabled),
	});
</script>

{@render children?.()}
