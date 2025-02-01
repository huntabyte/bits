<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { LinkPreviewTriggerProps } from "../types.js";
	import { useLinkPreviewTrigger } from "../link-preview.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		ref = $bindable(null),
		id = useId(),
		child,
		children,
		...restProps
	}: LinkPreviewTriggerProps = $props();

	const triggerState = useLinkPreviewTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

<FloatingLayer.Anchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<a {...mergedProps}>
			{@render children?.()}
		</a>
	{/if}
</FloatingLayer.Anchor>
