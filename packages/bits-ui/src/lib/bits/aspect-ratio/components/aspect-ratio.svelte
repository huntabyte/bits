<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AspectRatioRootProps } from "../types.js";
	import { useAspectRatioRoot } from "../aspect-ratio.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		ratio = 1,
		children,
		child,
		...restProps
	}: AspectRatioRootProps = $props();

	const rootState = useAspectRatioRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		ratio: box.with(() => ratio),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

<div style:position="relative" style:width="100%" style:padding-bottom="{ratio ? 100 / ratio : 0}%">
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
