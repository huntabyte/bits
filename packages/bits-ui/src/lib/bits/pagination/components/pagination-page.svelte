<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PaginationPageProps } from "../types.js";
	import { usePaginationPage } from "../pagination.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		page,
		child,
		children,
		type = "button",
		ref = $bindable(null),
		disabled = false,
		...restProps
	}: PaginationPageProps = $props();

	const pageState = usePaginationPage({
		id: box.with(() => id),
		page: box.with(() => page),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, pageState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{#if children}
			{@render children?.()}
		{:else}
			{page.value}
		{/if}
	</button>
{/if}
