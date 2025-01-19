<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuLinkProps } from "../types.js";
	import { useNavigationMenuLink } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		active = false,
		onSelect = noop,
		...restProps
	}: NavigationMenuLinkProps = $props();

	const linkState = useNavigationMenuLink({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		active: box.with(() => active),
		onSelect: box.with(() => onSelect),
	});

	const mergedProps = $derived(mergeProps(restProps, linkState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
