<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CheckboxGroupProps } from "../types.js";
	import { useCheckboxGroup } from "../checkbox.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		value = $bindable([]),
		onValueChange = noop,
		name,
		required,
		disabled,
		children,
		child,
		...restProps
	}: CheckboxGroupProps = $props();

	const groupState = useCheckboxGroup({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => Boolean(disabled)),
		required: box.with(() => Boolean(required)),
		name: box.with(() => name),
		value: box.with(
			() => value,
			(v) => onValueChange(v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
