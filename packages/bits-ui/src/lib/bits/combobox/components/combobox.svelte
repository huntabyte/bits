<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import type { ComboboxRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { useSelectRoot } from "$lib/bits/select/select.svelte.js";
	import ListboxHiddenInput from "$lib/bits/select/components/select-hidden-input.svelte";

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
		allowDeselect = true,
		children,
	}: ComboboxRootProps = $props();

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
				// @ts-expect-error - we know
				onValueChange(v);
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
		isCombobox: true,
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
			<ListboxHiddenInput value={item} />
		{/each}
	{/if}
{:else}
	<ListboxHiddenInput bind:value={rootState.value.current as string} />
{/if}
