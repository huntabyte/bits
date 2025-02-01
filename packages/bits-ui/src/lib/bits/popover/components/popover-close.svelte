<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PopoverCloseProps } from "../types.js";
	import { usePopoverClose } from "../popover.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: PopoverCloseProps = $props();

	const closeState = usePopoverClose({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
