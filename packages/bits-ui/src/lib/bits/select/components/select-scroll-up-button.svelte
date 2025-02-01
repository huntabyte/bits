<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectScrollUpButtonProps } from "../types.js";
	import { useSelectScrollUpButton } from "../select.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { Mounted } from "$lib/bits/utilities/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: SelectScrollUpButtonProps = $props();

	const scrollButtonState = useSelectScrollUpButton({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, scrollButtonState.props));
</script>

{#if scrollButtonState.canScrollUp}
	<Mounted onMountedChange={(v) => (scrollButtonState.state.mounted = v)} />
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
