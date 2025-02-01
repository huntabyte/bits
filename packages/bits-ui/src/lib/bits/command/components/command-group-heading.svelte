<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCommandGroupHeading } from "../command.svelte.js";
	import type { CommandGroupHeadingProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandGroupHeadingProps = $props();

	const headingState = useCommandGroupHeading({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
