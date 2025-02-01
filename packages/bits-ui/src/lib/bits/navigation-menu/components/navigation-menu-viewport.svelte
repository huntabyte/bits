<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuViewportProps } from "../types.js";
	import { useNavigationMenuViewport } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuViewportProps = $props();

	const viewportState = useNavigationMenuViewport({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

<PresenceLayer {id} present={forceMount || viewportState.open}>
	{#snippet presence()}
		{#if child}
			{@render child({ props: mergedProps })}
		{:else}
			<div {...mergedProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PresenceLayer>
