<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCalendarGridHead } from "../calendar.svelte.js";
	import type { CalendarGridHeadProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: CalendarGridHeadProps = $props();

	const gridHeadState = useCalendarGridHead({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridHeadState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<thead {...mergedProps}>
		{@render children?.()}
	</thead>
{/if}
