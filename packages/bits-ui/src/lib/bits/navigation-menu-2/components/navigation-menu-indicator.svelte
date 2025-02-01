<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuIndicatorProps } from "../types.js";
	import { useNavigationMenuIndicator } from "../navigation-menu.svelte.js";
	import NavigationMenuIndicatorImpl from "./navigation-menu-indicator-impl.svelte";
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

	const indicatorState = useNavigationMenuIndicator();
	const mergedProps = $derived(mergeProps(restProps));
</script>

{#if indicatorState.context.indicatorTrackRef.current}
	<Portal to={indicatorState.context.indicatorTrackRef.current}>
		<PresenceLayer {id} present={forceMount || indicatorState.isVisible}>
			{#snippet presence()}
				<NavigationMenuIndicatorImpl {...mergedProps} {children} {child} {id} bind:ref />
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}
