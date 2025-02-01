<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ToggleGroupItemProps } from "../types.js";
	import { useToggleGroupItem } from "../toggle-group.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		disabled = false,
		id = useId(),
		type = "button",
		...restProps
	}: ToggleGroupItemProps = $props();

	const itemState = useToggleGroupItem({
		id: box.with(() => id),
		value: box.with(() => value),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, pressed: itemState.isPressed })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ pressed: itemState.isPressed })}
	</button>
{/if}
