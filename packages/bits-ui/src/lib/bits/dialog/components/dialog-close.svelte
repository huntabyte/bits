<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useDialogClose } from "../dialog.svelte.js";
	import type { DialogCloseProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		disabled = false,
		...restProps
	}: DialogCloseProps = $props();

	const closeState = useDialogClose({
		variant: box.with(() => "close"),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => Boolean(disabled)),
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
