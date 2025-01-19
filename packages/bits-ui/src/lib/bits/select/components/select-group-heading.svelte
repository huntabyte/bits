<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectGroupHeadingProps } from "../types.js";
	import { useSelectGroupHeading } from "../select.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: SelectGroupHeadingProps = $props();

	const groupHeadingState = useSelectGroupHeading({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupHeadingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
