<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuTriggerProps } from "../types.js";
	import { useMenuDropdownTrigger } from "../menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		type = "button",
		...restProps
	}: MenuTriggerProps = $props();

	const triggerState = useMenuDropdownTrigger({
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
