<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AlertDialogActionProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { useAlertDialogAction } from "$lib/bits/dialog/dialog.svelte.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: AlertDialogActionProps = $props();

	const actionState = useAlertDialogAction({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, actionState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
