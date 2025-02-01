<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CheckboxRootProps } from "../types.js";
	import { useCheckboxRoot } from "../checkbox.svelte.js";
	import CheckboxInput from "./checkbox-input.svelte";
	import { useId } from "$lib/internal/use-id.js";

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		onCheckedChange,
		children,
		disabled = false,
		required = false,
		name = undefined,
		value = "on",
		id = useId(),
		indeterminate = $bindable(false),
		onIndeterminateChange,
		child,
		type = "button",
		...restProps
	}: CheckboxRootProps = $props();

	const rootState = useCheckboxRoot({
		checked: box.with(
			() => checked,
			(v) => {
				checked = v;
				onCheckedChange?.(v);
			}
		),
		disabled: box.with(() => disabled ?? false),
		required: box.with(() => required),
		name: box.with(() => name),
		value: box.with(() => value),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		indeterminate: box.with(
			() => indeterminate,
			(v) => {
				indeterminate = v;
				onIndeterminateChange?.(v);
			}
		),
		type: box.with(() => type),
	});

	const mergedProps = $derived(mergeProps({ ...restProps }, rootState.props));
</script>

{#if child}
	{@render child({
		props: mergedProps,
		...rootState.snippetProps,
	})}
{:else}
	<button {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</button>
{/if}

<CheckboxInput />
