<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCalendarDay } from "../calendar.svelte.js";
	import type { CalendarDayProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: CalendarDayProps = $props();

	const dayState = useCalendarDay({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, dayState.props));
</script>

{#if child}
	{@render child({
		props: mergedProps,
		...dayState.snippetProps,
	})}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children?.(dayState.snippetProps)}
		{:else}
			{dayState.cell.date.current.day}
		{/if}
	</div>
{/if}
