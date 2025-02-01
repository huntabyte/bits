<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandLinkItemProps } from "../types.js";
	import { CommandGroupContainerContext, useCommandItem } from "../command.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = "",
		disabled = false,
		children,
		child,
		onSelect = noop,
		forceMount = false,
		keywords = [],
		...restProps
	}: CommandLinkItemProps = $props();

	const group = CommandGroupContainerContext.getOr(null);

	const itemState = useCommandItem({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => onSelect),
		forceMount: box.with(() => forceMount),
		keywords: box.with(() => keywords),
		group,
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#key itemState.root.key}
	<div style="display: contents;">
		{#if itemState.shouldRender}
			{#if child}
				{@render child({ props: mergedProps })}
			{:else}
				<a {...mergedProps}>
					{@render children?.()}
				</a>
			{/if}
		{/if}
	</div>
{/key}
