<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCalendarNextButton } from "../calendar.svelte.js";
	import type { CalendarNextButtonProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: CalendarNextButtonProps = $props();

	const nextButtonState = useCalendarNextButton({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, nextButtonState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
