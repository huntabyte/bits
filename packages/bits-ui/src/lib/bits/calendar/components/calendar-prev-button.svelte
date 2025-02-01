<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CalendarPrevButtonProps } from "../types.js";
	import { useCalendarPrevButton } from "../calendar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: CalendarPrevButtonProps = $props();

	const prevButtonState = useCalendarPrevButton({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, prevButtonState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
