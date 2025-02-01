<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useAccordionContent } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		child,
		ref = $bindable(null),
		id = useId(),
		forceMount = false,
		children,
		...restProps
	}: AccordionContentProps = $props();

	const contentState = useAccordionContent({
		forceMount: box.with(() => forceMount),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
</script>

<PresenceLayer forceMount={true} present={contentState.present} {id}>
	{#snippet presence({ present })}
		{@const mergedProps = mergeProps(restProps, contentState.props, {
			hidden: forceMount ? undefined : !present.current,
		})}
		{#if child}
			{@render child({
				props: mergedProps,
				...contentState.snippetProps,
			})}
		{:else}
			<div {...mergedProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PresenceLayer>
