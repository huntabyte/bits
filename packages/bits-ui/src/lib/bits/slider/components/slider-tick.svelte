<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SliderTickProps } from "../types.js";
	import { useSliderTick } from "../slider.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		index,
		...restProps
	}: SliderTickProps = $props();

	const tickState = useSliderTick({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		index: box.with(() => index),
	});

	const mergedProps = $derived(mergeProps(restProps, tickState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>{@render children?.()}</span>
{/if}
