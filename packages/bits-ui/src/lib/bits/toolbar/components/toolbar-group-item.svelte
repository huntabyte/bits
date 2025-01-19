<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ToolbarGroupItemProps } from "../types.js";
	import { useToolbarGroupItem } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		value,
		disabled = false,
		type = "button",
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: ToolbarGroupItemProps = $props();

	const groupItemState = useToolbarGroupItem({
		id: box.with(() => id),
		value: box.with(() => value),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupItemState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, pressed: groupItemState.isPressed })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ pressed: groupItemState.isPressed })}
	</button>
{/if}
