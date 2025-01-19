<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuRadioItemProps } from "../types.js";
	import { useMenuRadioItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		onSelect = noop,
		id = useId(),
		disabled = false,
		closeOnSelect = true,
		...restProps
	}: MenuRadioItemProps = $props();

	const radioItemState = useMenuRadioItem({
		value: box.with(() => value),
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => handleSelect),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		closeOnSelect: box.with(() => closeOnSelect),
	});

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		radioItemState.selectValue();
	}

	const mergedProps = $derived(mergeProps(restProps, radioItemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, checked: radioItemState.isChecked })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ checked: radioItemState.isChecked })}
	</div>
{/if}
