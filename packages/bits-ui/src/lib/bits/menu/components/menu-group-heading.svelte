<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuGroupHeadingProps } from "../types.js";
	import { useMenuGroupHeading } from "../menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: MenuGroupHeadingProps = $props();

	const groupHeadingState = useMenuGroupHeading({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, groupHeadingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
