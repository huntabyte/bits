<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCalendarHeadCell } from "../calendar.svelte.js";
	import type { CalendarHeadCellProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: CalendarHeadCellProps = $props();

	const headCellState = useCalendarHeadCell({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headCellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<th {...mergedProps}>
		{@render children?.()}
	</th>
{/if}
