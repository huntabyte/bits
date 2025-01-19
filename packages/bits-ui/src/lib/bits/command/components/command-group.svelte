<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandGroupProps } from "../types.js";
	import { useCommandGroupContainer } from "../command.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = "",
		forceMount = false,
		children,
		child,
		...restProps
	}: CommandGroupProps = $props();

	const groupState = useCommandGroupContainer({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: box.with(() => forceMount),
		value: box.with(() => value),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
