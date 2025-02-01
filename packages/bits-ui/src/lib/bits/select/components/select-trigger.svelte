<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useSelectTrigger } from "../select.svelte.js";
	import type { SelectTriggerProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		type = "button",
		...restProps
	}: SelectTriggerProps = $props();

	const triggerState = useSelectTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayer.Anchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
