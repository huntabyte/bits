<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AvatarRootProps } from "../types.js";
	import { useAvatarRoot } from "../avatar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		delayMs = 0,
		loadingStatus = $bindable("loading"),
		onLoadingStatusChange,
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: AvatarRootProps = $props();

	const rootState = useAvatarRoot({
		delayMs: box.with(() => delayMs),
		loadingStatus: box.with(
			() => loadingStatus,
			(v) => {
				if (loadingStatus !== v) {
					loadingStatus = v;
					onLoadingStatusChange?.(v);
				}
			}
		),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
