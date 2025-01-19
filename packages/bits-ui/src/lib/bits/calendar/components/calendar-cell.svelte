<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCalendarCell } from "../calendar.svelte.js";
	import type { CalendarCellProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		date,
		month,
		...restProps
	}: CalendarCellProps = $props();

	const cellState = useCalendarCell({
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
	{@render child({
		props: mergedProps,
		...cellState.snippetProps,
	})}
{:else}
	<td {...mergedProps}>
		{@render children?.(cellState.snippetProps)}
	</td>
{/if}
