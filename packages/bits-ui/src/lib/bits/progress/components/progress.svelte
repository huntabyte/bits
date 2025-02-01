<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ProgressRootProps } from "../types.js";
	import { useProgressRootState } from "../progress.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		value = 0,
		max = 100,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: ProgressRootProps = $props();

	const rootState = useProgressRootState({
		value: box.with(() => value),
		max: box.with(() => max),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
