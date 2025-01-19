<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ScrollAreaRootProps } from "../types.js";
	import { useScrollAreaRoot } from "../scroll-area.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		type = "hover",
		dir = "ltr",
		scrollHideDelay = 600,
		children,
		child,
		...restProps
	}: ScrollAreaRootProps = $props();

	const rootState = useScrollAreaRoot({
		type: box.with(() => type),
		dir: box.with(() => dir),
		scrollHideDelay: box.with(() => scrollHideDelay),
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
