<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ToolbarRootProps } from "../types.js";
	import { useToolbarRoot } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		orientation = "horizontal",
		loop = true,
		child,
		children,
		...restProps
	}: ToolbarRootProps = $props();

	const rootState = useToolbarRoot({
		id: box.with(() => id),
		orientation: box.with(() => orientation),
		loop: box.with(() => loop),
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
