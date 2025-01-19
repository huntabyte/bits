<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useDialogTrigger } from "../dialog.svelte.js";
	import type { DialogTriggerProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		disabled = false,
		...restProps
	}: DialogTriggerProps = $props();

	const triggerState = useDialogTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
