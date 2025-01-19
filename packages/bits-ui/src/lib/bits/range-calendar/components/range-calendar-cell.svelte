<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RangeCalendarCellProps } from "../types.js";
	import { useRangeCalendarCell } from "../range-calendar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		date,
		month,
		...restProps
	}: RangeCalendarCellProps = $props();

	const cellState = useRangeCalendarCell({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		date: box.with(() => date),
		month: box.with(() => month),
	});

	const mergedProps = $derived(mergeProps(restProps, cellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...cellState.snippetProps })}
{:else}
	<td {...mergedProps}>
		{@render children?.(cellState.snippetProps)}
	</td>
{/if}
