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
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
	const wrapperProps = $derived(mergeProps(listState.wrapperProps));
</script>

{#if child}
	{@render child({ props: mergedProps, wrapperProps })}
{:else}
	<div {...wrapperProps}>
		<ul {...mergedProps}>
			{@render children?.()}
		</ul>
	</div>
{/if}
