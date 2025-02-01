<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AccordionTriggerProps } from "../types.js";
	import { useAccordionTrigger } from "../accordion.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		disabled = false,
		ref = $bindable(null),
		id = useId(),
		children,
		child,
		...restProps
	}: AccordionTriggerProps = $props();

	const triggerState = useAccordionTrigger({
		disabled: box.with(() => disabled),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button type="button" {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
