<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RadioGroupItemProps } from "../types.js";
	import { useRadioGroupItem } from "../radio-group.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		children,
		child,
		value,
		disabled = false,
		ref = $bindable(null),
		...restProps
	}: RadioGroupItemProps = $props();

	const itemState = useRadioGroupItem({
		value: box.with(() => value),
		disabled: box.with(() => disabled ?? false),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
