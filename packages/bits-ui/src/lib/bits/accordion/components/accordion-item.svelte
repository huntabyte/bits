<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AccordionItemProps } from "../types.js";
	import { useAccordionItem } from "../accordion.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		disabled = false,
		value = useId(),
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: AccordionItemProps = $props();

	const itemState = useAccordionItem({
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
