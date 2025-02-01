<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useDialogDescription } from "../dialog.svelte.js";
	import type { DialogDescriptionProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: DialogDescriptionProps = $props();

	const descriptionState = useDialogDescription({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, descriptionState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
