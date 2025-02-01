<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AccordionHeaderProps } from "../types.js";
	import { useAccordionHeader } from "../accordion.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		level = 2,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: AccordionHeaderProps = $props();

	const headerState = useAccordionHeader({
		id: box.with(() => id),
		level: box.with(() => level),
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
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
