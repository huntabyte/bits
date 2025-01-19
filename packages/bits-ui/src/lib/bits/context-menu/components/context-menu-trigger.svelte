<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ContextMenuTriggerProps } from "../types.js";
	import { useMenuContextTrigger } from "$lib/bits/menu/menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		...restProps
	}: ContextMenuTriggerProps = $props();

	const triggerState = useMenuContextTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(restProps, triggerState.props, { style: { pointerEvents: "auto" } })
	);
</script>

<FloatingLayer.Anchor {id} virtualEl={triggerState.virtualElement}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayer.Anchor>
