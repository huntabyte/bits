<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AlertDialogCancelProps } from "../types.js";
	import { useAlertDialogCancel } from "$lib/bits/dialog/dialog.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		disabled = false,
		...restProps
	}: AlertDialogCancelProps = $props();

	const cancelState = useAlertDialogCancel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, cancelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
