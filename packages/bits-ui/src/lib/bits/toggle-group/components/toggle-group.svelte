<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import { mergeProps } from "svelte-toolbelt";
	import type { ToggleGroupRootProps } from "../types.js";
	import { useToggleGroupRoot } from "../toggle-group.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		type,
		disabled = false,
		loop = true,
		orientation = "horizontal",
		rovingFocus = true,
		child,
		children,
		...restProps
	}: ToggleGroupRootProps = $props();

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];

		value = defaultValue;
	}

	const rootState = useToggleGroupRoot({
		id: box.with(() => id),
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: box.with(() => disabled),
		loop: box.with(() => loop),
		orientation: box.with(() => orientation),
		rovingFocus: box.with(() => rovingFocus),
		type,
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
