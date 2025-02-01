<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import { mergeProps } from "svelte-toolbelt";
	import type { ToolbarGroupProps } from "../types.js";
	import { useToolbarGroup } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		type,
		disabled = false,
		child,
		children,
		...restProps
	}: ToolbarGroupProps = $props();

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];
		value = defaultValue;
	}

	const groupState = useToolbarGroup({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		ref: box.with(
			() => ref,
			(v) => (ref = v)
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
