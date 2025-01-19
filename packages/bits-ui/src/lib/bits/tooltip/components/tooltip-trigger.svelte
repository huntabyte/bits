<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TooltipTriggerProps } from "../types.js";
	import { useTooltipTrigger } from "../tooltip.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";

	let {
		children,
		child,
		id = useId(),
		disabled = false,
		type = "button",
		ref = $bindable(null),
		...restProps
	}: TooltipTriggerProps = $props();

	const triggerState = useTooltipTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayerAnchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
