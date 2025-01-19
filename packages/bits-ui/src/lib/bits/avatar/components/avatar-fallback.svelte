<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AvatarFallbackProps } from "../types.js";
	import { useAvatarFallback } from "../avatar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: AvatarFallbackProps = $props();

	const fallbackState = useAvatarFallback({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, fallbackState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
