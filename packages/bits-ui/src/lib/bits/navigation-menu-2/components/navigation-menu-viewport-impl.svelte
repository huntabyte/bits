<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuViewportProps } from "../types.js";
	import { useNavigationMenuViewportImpl } from "../navigation-menu.svelte.js";
	import NavigationMenuContentImpl from "./navigation-menu-content-impl.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		...restProps
	}: NavigationMenuViewportProps = $props();

	const viewportState = useNavigationMenuViewportImpl({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));

	const viewportContent = $derived.by(() => {
		viewportState.context.viewportContent.keys();
		return Array.from(viewportState.context.viewportContent);
	});
</script>

<div {...mergedProps}>
	{#each viewportContent as [value, item]}
		{@const isActive = viewportState.activeContentValue === value}
		<PresenceLayer
			id={(item.contentProps.current.id as string) ?? useId()}
			present={forceMount || isActive}
		>
			{#snippet presence()}
				<NavigationMenuContentImpl
					itemState={item}
					{...item.contentProps.current}
					children={item.contentChild.current}
					child={item.contentChild.current}
					onRefChange={(v) => {
						if (isActive && v) {
							viewportState.contentNode = v;
						}
					}}
				/>
			{/snippet}
		</PresenceLayer>
	{/each}
</div>
