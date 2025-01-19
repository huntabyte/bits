<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { IsMounted } from "runed";
	import type { ScrollAreaThumbProps } from "../types.js";
	import { useScrollAreaThumb } from "../scroll-area.svelte.js";

	let {
		ref = $bindable(null),
		id,
		child,
		children,
		present,
		...restProps
	}: Omit<ScrollAreaThumbProps, "forceMount" | "id"> & {
		id: string;
		present: boolean;
	} = $props();

	const isMounted = new IsMounted();

	const thumbState = useScrollAreaThumb({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		mounted: box.with(() => isMounted.current),
	});

	const mergedProps = $derived(
		mergeProps(restProps, thumbState.props, {
			style: {
				hidden: !present,
			},
		})
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
