<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TabsListProps } from "../types.js";
	import { useTabsList } from "../tabs.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: TabsListProps = $props();

	const listState = useTabsList({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
