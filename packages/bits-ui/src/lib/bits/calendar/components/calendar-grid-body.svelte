<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CalendarGridBodyProps } from "../types.js";
	import { useCalendarGridBody } from "../calendar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: CalendarGridBodyProps = $props();

	const gridBodyState = useCalendarGridBody({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridBodyState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<tbody {...mergedProps}>
		{@render children?.()}
	</tbody>
{/if}
