<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RadioGroupRootProps } from "../types.js";
	import { useRadioGroupRoot } from "../radio-group.svelte.js";
	import RadioGroupInput from "./radio-group-input.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		disabled = false,
		children,
		child,
		value = $bindable(""),
		ref = $bindable(null),
		orientation = "vertical",
		loop = true,
		name = undefined,
		required = false,
		id = useId(),
		onValueChange = noop,
		...restProps
	}: RadioGroupRootProps = $props();

	const rootState = useRadioGroupRoot({
		orientation: box.with(() => orientation),
		disabled: box.with(() => disabled),
		loop: box.with(() => loop),
		name: box.with(() => name),
		required: box.with(() => required),
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				if (v === value) return;
				value = v;
				onValueChange?.(v);
			}
		),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<RadioGroupInput />
