<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCalendarGrid } from "../calendar.svelte.js";
	import type { CalendarGridProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: CalendarGridProps = $props();

	const gridState = useCalendarGrid({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<table {...mergedProps}>
		{@render children?.()}
	</table>
{/if}
