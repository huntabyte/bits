<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CollapsibleTriggerProps } from "../types.js";
	import { useCollapsibleTrigger } from "../collapsible.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		disabled = false,
		...restProps
	}: CollapsibleTriggerProps = $props();

	const triggerState = useCollapsibleTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
