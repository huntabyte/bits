<script lang="ts">
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { type WritableBox, box } from "svelte-toolbelt";
	import { useSelectRoot } from "../select.svelte.js";
	import type { SelectRootProps } from "../types.js";
	import SelectHiddenInput from "./select-hidden-input.svelte";

	let {
		value = $bindable(),
		onValueChange = noop,
		name = "",
		disabled = false,
		type,
		open = $bindable(false),
		onOpenChange = noop,
		loop = false,
		scrollAlignment = "nearest",
		required = false,
		items = [],
		allowDeselect = false,
		children,
	}: SelectRootProps = $props();

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];

		value = defaultValue;
	}

	const rootState = useSelectRoot({
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onValueChange(v as any);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: box.with(() => disabled),
		required: box.with(() => required),
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		loop: box.with(() => loop),
		scrollAlignment: box.with(() => scrollAlignment),
		name: box.with(() => name),
		isCombobox: false,
		items: box.with(() => items),
		allowDeselect: box.with(() => allowDeselect),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>

{#if Array.isArray(rootState.value.current)}
	{#if rootState.value.current.length}
		{#each rootState.value.current as item}
			<SelectHiddenInput value={item} />
		{/each}
	{/if}
{:else}
	<SelectHiddenInput bind:value={rootState.value.current as string} />
{/if}
