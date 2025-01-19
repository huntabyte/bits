<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useSelectItem } from "../select.svelte.js";
	import type { SelectItemProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		value,
		label = value,
		disabled = false,
		children,
		child,
		onHighlight = noop,
		onUnhighlight = noop,
		...restProps
	}: SelectItemProps = $props();

	const itemState = useSelectItem({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		label: box.with(() => label),
		onHighlight: box.with(() => onHighlight),
		onUnhighlight: box.with(() => onUnhighlight),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</div>
{/if}

<Mounted
	onMountedChange={(m) => {
		itemState.mounted = m;
	}}
/>
