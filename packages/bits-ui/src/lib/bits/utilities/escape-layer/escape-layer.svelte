<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { EscapeLayerImplProps } from "./types.js";
	import { useEscapeLayer } from "./use-escape-layer.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		escapeKeydownBehavior = "close",
		onEscapeKeydown = noop,
		children,
		enabled,
	}: EscapeLayerImplProps = $props();

	useEscapeLayer({
		escapeKeydownBehavior: box.with(() => escapeKeydownBehavior),
		onEscapeKeydown: box.with(() => onEscapeKeydown),
		enabled: box.with(() => enabled),
	});
</script>

{@render children?.()}
