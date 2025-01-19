<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PaginationRootProps } from "../types.js";
	import { usePaginationRoot } from "../pagination.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		count,
		perPage = 1,
		page = $bindable(1),
		ref = $bindable(null),
		siblingCount = 1,
		onPageChange = noop,
		loop = false,
		orientation = "horizontal",
		child,
		children,
		...restProps
	}: PaginationRootProps = $props();

	const rootState = usePaginationRoot({
		id: box.with(() => id),
		count: box.with(() => count),
		perPage: box.with(() => perPage),
		page: box.with(
			() => page,
			(v) => {
				page = v;
				onPageChange?.(v);
			}
		),
		loop: box.with(() => loop),
		siblingCount: box.with(() => siblingCount),
		orientation: box.with(() => orientation),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
