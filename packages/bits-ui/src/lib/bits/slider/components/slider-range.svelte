<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SliderRangeProps } from "../types.js";
	import { useSliderRange } from "../slider.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: SliderRangeProps = $props();

	const rangeState = useSliderRange({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, rangeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
