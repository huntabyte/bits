<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ComboboxInputProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { useSelectInput } from "$lib/bits/select/select.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		defaultValue,
		...restProps
	}: ComboboxInputProps = $props();

	const inputState = useSelectInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	if (defaultValue) {
		inputState.root.inputValue = defaultValue;
	}

	const mergedProps = $derived(
		mergeProps(restProps, inputState.props, { value: inputState.root.inputValue })
	);
</script>

<FloatingLayer.Anchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<input {...mergedProps} />
	{/if}
</FloatingLayer.Anchor>
