<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuSeparatorProps } from "../types.js";
	import { useMenuSeparator } from "../menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		child,
		children,
		...restProps
	}: MenuSeparatorProps = $props();

	const separatorState = useMenuSeparator({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
