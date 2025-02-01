<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useToolbarLink } from "../toolbar.svelte.js";
	import type { ToolbarLinkProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		href,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: ToolbarLinkProps = $props();

	const linkState = useToolbarLink({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, linkState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {href} {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
