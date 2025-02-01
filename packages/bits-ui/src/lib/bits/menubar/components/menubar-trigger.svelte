<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenubarTriggerProps } from "../types.js";
	import { useMenubarTrigger } from "../menubar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { useMenuDropdownTrigger } from "$lib/bits/menu/menu.svelte.js";

	let {
		id = useId(),
		disabled = false,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: MenubarTriggerProps = $props();

	const triggerState = useMenubarTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	useMenuDropdownTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
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
