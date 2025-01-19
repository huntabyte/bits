<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandListProps } from "../types.js";
	import { useCommandList } from "../command.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		"aria-label": ariaLabel,
		...restProps
	}: CommandListProps = $props();

	const listState = useCommandList({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		ariaLabel: box.with(() => ariaLabel ?? "Suggestions..."),
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
