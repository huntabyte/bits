<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuIndicatorProps } from "../types.js";
	import { useNavigationMenuIndicator } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuIndicatorProps = $props();

	const indicatorState = useNavigationMenuIndicator({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, indicatorState.props));
</script>

{#if indicatorState.menu.indicatorTrackNode}
	<Portal to={indicatorState.menu.indicatorTrackNode}>
		<PresenceLayer {id} present={forceMount || indicatorState.isVisible}>
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
	</Portal>
{/if}
