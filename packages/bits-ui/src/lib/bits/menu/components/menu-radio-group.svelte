<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuRadioGroupProps } from "../types.js";
	import { useMenuRadioGroup } from "../menu.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		children,
		child,
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = noop,
		...restProps
	}: MenuRadioGroupProps = $props();

	const radioGroupState = useMenuRadioGroup({
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, radioGroupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
