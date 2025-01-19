<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCalendarGridRow } from "../calendar.svelte.js";
	import type { CalendarGridRowProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: CalendarGridRowProps = $props();

	const gridRowState = useCalendarGridRow({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridRowState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<tr {...mergedProps}>
		{@render children?.()}
	</tr>
{/if}
