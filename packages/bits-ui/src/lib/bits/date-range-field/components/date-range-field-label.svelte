<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useDateRangeFieldLabel } from "../date-range-field.svelte.js";
	import type { DateRangeFieldLabelProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: DateRangeFieldLabelProps = $props();

	const labelState = useDateRangeFieldLabel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
