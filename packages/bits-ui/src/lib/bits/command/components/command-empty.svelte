<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandEmptyProps } from "../types.js";
	import { useCommandEmpty } from "../command.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		...restProps
	}: CommandEmptyProps = $props();

	const emptyState = useCommandEmpty({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: box.with(() => forceMount),
	});

	const mergedProps = $derived(mergeProps(emptyState.props, restProps));
</script>

{#if emptyState.shouldRender}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
