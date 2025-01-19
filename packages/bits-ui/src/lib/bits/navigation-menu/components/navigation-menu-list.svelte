<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuListProps } from "../types.js";
	import { useNavigationMenuList } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: NavigationMenuListProps = $props();

	const listState = useNavigationMenuList({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		indicatorTrackRef: box(null),
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
	const indicatorTrackProps = $derived(mergeProps(listState.indicatorTrackProps, {}));
</script>

<div {...indicatorTrackProps}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<ul {...mergedProps}>
			{@render children?.()}
		</ul>
	{/if}
</div>
