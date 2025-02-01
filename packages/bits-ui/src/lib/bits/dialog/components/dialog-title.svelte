<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useDialogTitle } from "../dialog.svelte.js";
	import type { DialogTitleProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		level = 2,
		...restProps
	}: DialogTitleProps = $props();

	const titleState = useDialogTitle({
		id: box.with(() => id),
		level: box.with(() => level),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, titleState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
