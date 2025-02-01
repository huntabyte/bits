<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandLoadingProps } from "../types.js";
	import { useCommandLoading } from "../command.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		progress = 0,
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandLoadingProps = $props();

	const loadingState = useCommandLoading({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		progress: box.with(() => progress),
	});

	const mergedProps = $derived(mergeProps(restProps, loadingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
