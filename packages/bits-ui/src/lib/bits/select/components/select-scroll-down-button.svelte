<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectScrollDownButtonProps } from "../types.js";
	import { useSelectScrollDownButton } from "../select.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { Mounted } from "$lib/bits/utilities/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: SelectScrollDownButtonProps = $props();

	let mounted = $state(false);

	const scrollDownButtonState = useSelectScrollDownButton({
		id: box.with(() => id),
		mounted: box.with(() => mounted),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, scrollDownButtonState.props));
</script>

{#if scrollDownButtonState.canScrollDown}
	<Mounted onMountedChange={(m) => (mounted = m)} />
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
