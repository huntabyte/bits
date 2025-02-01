<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandGroupItemsProps } from "../types.js";
	import { useCommandGroupItems } from "../command.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandGroupItemsProps = $props();

	const groupItemsState = useCommandGroupItems({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupItemsState.props));
</script>

<div style="display: contents;">
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
