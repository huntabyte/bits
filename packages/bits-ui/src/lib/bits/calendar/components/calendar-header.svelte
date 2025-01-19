<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCalendarHeader } from "../calendar.svelte.js";
	import type { CalendarHeaderProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: CalendarHeaderProps = $props();

	const headerState = useCalendarHeader({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<header {...mergedProps}>
		{@render children?.()}
	</header>
{/if}
