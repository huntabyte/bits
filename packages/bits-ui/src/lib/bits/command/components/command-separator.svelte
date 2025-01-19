<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandSeparatorProps } from "../types.js";
	import { useCommandSeparator } from "../command.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		children,
		child,
		...restProps
	}: CommandSeparatorProps = $props();

	const separatorState = useCommandSeparator({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: box.with(() => forceMount),
	});

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if separatorState.shouldRender}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
